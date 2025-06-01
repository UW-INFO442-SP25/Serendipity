import React, { useState, useEffect } from 'react';
import BehaviorChart from './BehaviorChart';
import './tracker.css';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import { db } from '../../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Tracker = () => {
  const [activeTab, setActiveTab] = useState('Insights');
  const [cpapData, setCpapData] = useState([]);
  const [cpapInputDate, setCpapInputDate] = useState('');
  const [cpapInputHours, setCpapInputHours] = useState('');
  const [symptom, setSymptom] = useState('');
  const [severity, setSeverity] = useState('Mild');
  const [symptomEntries, setSymptomEntries] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [mode, setMode] = useState('standard');
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  const threshold = mode === 'boost' ? 6 : 4;
  const lowUsage = cpapData.filter(d => d.hours < threshold);
  const severeCount = symptomEntries.filter(e => e.severity === 'Severe').length;
  const symptomMap = {};
  symptomEntries.forEach(e => {
    symptomMap[e.symptom] = (symptomMap[e.symptom] || 0) + 1;
  });
  const topSymptoms = Object.entries(symptomMap).sort((a, b) => b[1] - a[1]);
  const compliance = Math.round(cpapData.filter(d => d.hours >= threshold).length / cpapData.length * 100);

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const cpapQuery = query(collection(db, 'cpapData'), where('uid', '==', user.uid));
      const cpapSnapshot = await getDocs(cpapQuery);
      const userCpapData = cpapSnapshot.docs.map(doc => doc.data());
      setCpapData(userCpapData);

      const symptomQuery = query(collection(db, 'symptomEntries'), where('uid', '==', user.uid));
      const symptomSnapshot = await getDocs(symptomQuery);
      const userSymptomData = symptomSnapshot.docs.map(doc => doc.data());
      setSymptomEntries(userSymptomData);

      const deviceQuery = query(collection(db, 'deviceSettings'), where('uid', '==', user.uid));
      const deviceSnapshot = await getDocs(deviceQuery);
      if (!deviceSnapshot.empty) {
        const deviceData = deviceSnapshot.docs[0].data();
        setSelectedDevice(deviceData.device);
      }

      const modeQuery = query(collection(db, 'modeSettings'), where('uid', '==', user.uid));
      const modeSnapshot = await getDocs(modeQuery);
      if (!modeSnapshot.empty) {
        const modeData = modeSnapshot.docs[0].data();
        setMode(modeData.mode);
      }
    };
    fetchData();
  }, []);

  const handleSymptomSubmit = async () => {
    if (!symptom.trim()) return;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return alert('You must be signed in.');

    const newEntry = { symptom, severity, date: new Date().toISOString().slice(0, 10), uid: user.uid };
    try {
      await addDoc(collection(db, 'symptomEntries'), newEntry);
      setSymptomEntries([...symptomEntries, newEntry]);
      setSymptom('');
      setSeverity('Mild');
    } catch (err) {
      console.error('Error saving symptom:', err);
    }
  };

  const handleCpapAdd = async () => {
    if (!cpapInputDate || !cpapInputHours) return alert('Please enter both date and usage hours.');
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return alert('You must be signed in.');

    const newEntry = { date: cpapInputDate, hours: parseFloat(cpapInputHours), uid: user.uid };
    try {
      await addDoc(collection(db, 'cpapData'), newEntry);
      setCpapData([...cpapData, newEntry]);
      setCpapInputDate('');
      setCpapInputHours('');
    } catch (err) {
      console.error('Error saving CPAP data:', err);
    }
  };

  const handleDeviceSave = async () => {
    if (!selectedDevice) return;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return alert('You must be signed in.');

    try {
      await addDoc(collection(db, 'deviceSettings'), {
        uid: user.uid,
        device: selectedDevice,
        savedAt: new Date().toISOString()
      });
      alert(`Device "${selectedDevice}" saved.`);
    } catch (err) {
      console.error('Error saving device:', err);
    }
  };

  const handleSwitch = async (newMode) => {
    setMode(newMode);
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, 'modeSettings'), {
        uid: user.uid,
        mode: newMode,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error saving mode:', err);
    }
  };

  const renderInputTab = () => {
  const handleDeleteSymptom = async (id) => {
    try {
      await deleteDoc(doc(db, 'symptomEntries', id));
      setSymptomEntries(symptomEntries.filter(entry => entry.id !== id));
    } catch (err) {
      console.error('Error deleting symptom:', err);
    }
  };

  const handleEditSymptom = async (entry) => {
    const newSymptom = prompt("Edit symptom:", entry.symptom);
    const newSeverity = prompt("Edit severity (Mild, Moderate, Severe):", entry.severity);
    if (!newSymptom || !newSeverity) return;

    try {
      const updatedEntry = { ...entry, symptom: newSymptom, severity: newSeverity };
      await setDoc(doc(db, 'symptomEntries', entry.id), updatedEntry);
      setSymptomEntries(symptomEntries.map(e => (e.id === entry.id ? updatedEntry : e)));
    } catch (err) {
      console.error('Error editing symptom:', err);
    }
  };

  const handleDeleteCpap = async (id) => {
    try {
      await deleteDoc(doc(db, 'cpapData', id));
      setCpapData(cpapData.filter(entry => entry.id !== id));
    } catch (err) {
      console.error('Error deleting CPAP data:', err);
    }
  };

  const handleEditCpap = async (entry) => {
    const newDate = prompt("Edit date (YYYY-MM-DD):", entry.date);
    const newHours = prompt("Edit usage hours:", entry.hours);
    if (!newDate || !newHours || isNaN(parseFloat(newHours))) return;

    try {
      const updatedEntry = { ...entry, date: newDate, hours: parseFloat(newHours) };
      await setDoc(doc(db, 'cpapData', entry.id), updatedEntry);
      setCpapData(cpapData.map(e => (e.id === entry.id ? updatedEntry : e)));
    } catch (err) {
      console.error('Error editing CPAP data:', err);
    }
  };

  return (
    <div className="tab-content">
      <h3>Symptom Tracker</h3>
      <p>Log any symptoms you experience and their severity.</p>
      <input type="text" value={symptom} onChange={(e) => setSymptom(e.target.value)} placeholder="Symptom" />
      <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
        <option>Mild</option>
        <option>Moderate</option>
        <option>Severe</option>
      </select>
      
      <button onClick={handleSymptomSubmit}>Submit</button>
      <p>Submitted: {symptomEntries.length} entries</p>

      {symptomEntries.length > 0 && (
        <>
          <h4>Logged Symptoms</h4>
          <ul className="symptom-list">
            {symptomEntries.map((entry, index) => (
              <li key={entry.id || index}>
                <strong>{entry.date}</strong> — {entry.symptom} ({entry.severity})
                <button className="text-btn" onClick={() => handleEditSymptom(entry)}>Edit</button>
                <button className="text-btn danger" onClick={() => handleDeleteSymptom(entry.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3>CPAP Usage Input</h3>
      <p>Enter your CPAP usage for the selected date (in hours).</p>
      <input type="date" value={cpapInputDate} onChange={(e) => setCpapInputDate(e.target.value)} />
      <input type="number" value={cpapInputHours} onChange={(e) => setCpapInputHours(e.target.value)} placeholder="Usage Hours" />
      <button onClick={handleCpapAdd}>➕ Add to Chart</button>

      {cpapData.length > 0 && (
        <>
          <h4>Usage History</h4>
          <ul className="cpap-list">
            {cpapData.map((entry, index) => (
              <li key={entry.id || index}>
                {entry.date}: {entry.hours} hrs
                <button className="text-btn" onClick={() => handleEditCpap(entry)}>Edit</button>
                <button className="text-btn danger" onClick={() => handleDeleteCpap(entry.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};


  const renderInsightsTab = () => (<div className="tab-content">
    <h3>Weekly Insights</h3>
    <div className="chart-instructions">
      <h4>Instructions</h4>
      <ul>
        <li>Compliance threshold: {threshold} hours/day.</li>
        <li>Days below threshold are marked as alerts.</li>
        <li>Chart shows usage over time with a reference line at threshold.</li>
      </ul>
    </div>
    {lowUsage.length > 0 && (<div className="alert-box">
      <h4>Alerts</h4>
      <ul>{(showAllAlerts ? lowUsage : lowUsage.slice(0, 1)).map((entry, index) => (<li key={index}><strong>{entry.date}</strong>: {entry.hours} hrs</li>))}</ul>
      {lowUsage.length > 1 && (<button onClick={() => setShowAllAlerts(!showAllAlerts)}>{showAllAlerts ? 'Collapse' : 'View Full'}</button>)}
    </div>)}
    <BehaviorChart data={cpapData} mode={mode} />
  </div>);

  const renderSettingsTab = () => (<div className="tab-content">
    <h3>⚙️ Device & Mode Settings</h3>
    <p>Choose your device and adjust your monitoring mode:</p>
    <ul>
      <li><strong>Standard:</strong> Uses a 4-hour compliance threshold. Best for typical users.</li>
      <li><strong>Auto:</strong> Also uses 4 hours but allows future automation.</li>
      <li><strong>Boost:</strong> Requires 6 hours per night to promote higher adherence.</li>
    </ul>
    <label>Device:
      <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)}>
        <option value="">-- Choose a device --</option>
        <option value="ResMed AirSense 10">ResMed AirSense 10</option>
        <option value="Philips DreamStation">Philips DreamStation</option>
        <option value="CPAP Pro A7">CPAP Pro A7</option>
      </select>
      <button onClick={handleDeviceSave}>Save Device</button>
    </label>
    <div className="modes">
      {['standard', 'auto', 'boost'].map(m => (
        <button
          key={m}
          onClick={() => handleSwitch(m)}
          disabled={mode === m}
          style={{
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '30px',
            fontWeight: 500,
            cursor: mode === m ? 'default' : 'pointer',
            opacity: mode === m ? 1 : 0.9,
            boxShadow: mode === m ? '0 2px 6px rgba(0,0,0,0.2)' : 'none',
            marginRight: '0.5rem'
          }}>
          {m.charAt(0).toUpperCase() + m.slice(1)}
        </button>
      ))}
      <span>🟢 Current Mode: <strong>{mode}</strong></span>
    </div>
  </div>);

  const renderReportTab = () => {
    const totalHours = cpapData.reduce((sum, d) => sum + d.hours, 0);
    const avgUsage = cpapData.length ? (totalHours / cpapData.length).toFixed(1) : 0;
    const sortedDates = [...cpapData].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstDate = sortedDates[0]?.date || 'N/A';
    const lastDate = sortedDates[sortedDates.length - 1]?.date || 'N/A';
    const severityCount = { Mild: 0, Moderate: 0, Severe: 0 };
    symptomEntries.forEach(entry => severityCount[entry.severity]++);

    let streak = 0, maxStreak = 0;
    for (let i = 0; i < sortedDates.length; i++) {
      if (sortedDates[i].hours >= threshold) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else streak = 0;
    }

    const pieData = [
      { name: 'Mild', value: severityCount.Mild },
      { name: 'Moderate', value: severityCount.Moderate },
      { name: 'Severe', value: severityCount.Severe }
    ];
    const barData = [
      { name: 'Compliant', count: cpapData.filter(d => d.hours >= threshold).length },
      { name: 'Non-compliant', count: lowUsage.length }
    ];

    return (<div className="tab-content">
      <h3>Report Summary</h3>
      <p>
        <strong>What is Compliance Rate?</strong><br />
        The compliance rate is the percentage of nights where your CPAP usage met the threshold: <strong>{threshold} hrs/night</strong>.
        It’s used to gauge your consistency and treatment success.
      </p>
      <ul>
        <li>Low Usage Days: {lowUsage.length}</li>
        <li>Compliance Rate: {compliance}%</li>
        <li>Average Daily Usage: {avgUsage} hrs</li>
        <li>Longest Compliance Streak: {maxStreak} days</li>
        <li>Most Common Symptom: {topSymptoms[0]?.[0] || 'None'} ({topSymptoms[0]?.[1] || 0} times)</li>
        <li>Symptoms by Severity: Mild ({severityCount.Mild}), Moderate ({severityCount.Moderate}), Severe ({severityCount.Severe})</li>
        <li>Severe Symptoms Reported: {severeCount}</li>
        <li>Total Symptoms: {symptomEntries.length}</li>
        <li>Data Points: {cpapData.length}</li>
        <li>First Use Date: {firstDate}</li>
        <li>Last Input Date: {lastDate}</li>
        <li>Current Mode: {mode}</li>
      </ul>
      <h4>Symptoms Distribution</h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
            <Cell fill="#82ca9d" /><Cell fill="#8884d8" /><Cell fill="#ff7f7f" />
          </Pie>
          <Tooltip /><Legend />
        </PieChart>
      </ResponsiveContainer>
      <h4>Compliance Overview</h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={barData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#4ea8de" /></BarChart>
      </ResponsiveContainer>
      <h4>Usage Over Time</h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={sortedDates}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="hours" stroke="#ff7300" /></LineChart>
      </ResponsiveContainer>
    </div>);
  };

  return (<div className="behavior-container">
    <h1>Behavior Tracker And Analysis</h1>
    <p className="subtitle">Track symptoms, CPAP usage, and explore insights</p>
    <div className="tab-bar">
      <button className={activeTab === 'Insights' ? 'active' : ''} onClick={() => setActiveTab('Insights')}>Insights</button>
      <button className={activeTab === 'Input' ? 'active' : ''} onClick={() => setActiveTab('Input')}>Input</button>
      <button className={activeTab === 'Settings' ? 'active' : ''} onClick={() => setActiveTab('Settings')}>Settings</button>
      <button className={activeTab === 'Report' ? 'active' : ''} onClick={() => setActiveTab('Report')}>Report</button>
    </div>
    {activeTab === 'Input' && renderInputTab()}
    {activeTab === 'Insights' && renderInsightsTab()}
    {activeTab === 'Settings' && renderSettingsTab()}
    {activeTab === 'Report' && renderReportTab()}
  </div>);
};

export default Tracker;

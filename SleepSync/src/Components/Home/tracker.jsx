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
  const [showSymptomHistory, setShowSymptomHistory] = useState(false);
  const [showCpapHistory, setShowCpapHistory] = useState(false);

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
  return (
    <div className="tab-content" role="region" aria-labelledby="input-heading">
      <h3 id="input-heading">Input Your Daily Data</h3>

      {/* Symptom Tracker Section */}
      <section role="region" aria-labelledby="symptom-heading" className="form-section">
        <h4 id="symptom-heading">Symptom Tracker</h4>
        <p>Log any symptoms you experience and their severity.</p>

        <div className="form-group">
          <label htmlFor="symptomInput">Symptom</label>
          <input
            id="symptomInput"
            type="text"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="e.g., Headache"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="severitySelect">Severity</label>
          <select
            id="severitySelect"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </div>

        {/* Right-aligned submit button */}
        <div className="form-actions right">
          <button onClick={handleSymptomSubmit}>Submit Symptom</button>
        </div>

        {/* Left-aligned toggle button */}
        <div className="form-actions left">
          <button onClick={() => setShowSymptomHistory(prev => !prev)}>
            {showSymptomHistory ? 'Hide Symptom History' : 'Show Symptom History'}
          </button>
        </div>

        {/* History List */}
        {showSymptomHistory && (
          <div className="history-section">
            <h5>Recent Symptom Entries:</h5>
            <ul>
              {symptomEntries.slice().reverse().slice(0, 5).map((entry, idx) => (
                <li key={idx}>
                  <strong>{entry.date}</strong>: {entry.symptom} ({entry.severity})
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* CPAP Usage Section */}
      <section role="region" aria-labelledby="cpap-heading" className="form-section" style={{ marginTop: '2rem' }}>
        <h4 id="cpap-heading">CPAP Usage Input</h4>
        <p>Enter your CPAP usage for today.</p>

        <div className="form-group">
          <label htmlFor="cpapDate">Date</label>
          <input
            id="cpapDate"
            type="date"
            value={cpapInputDate}
            onChange={(e) => setCpapInputDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cpapHours">Usage Hours</label>
          <input
            id="cpapHours"
            type="number"
            min="0"
            step="0.1"
            value={cpapInputHours}
            onChange={(e) => setCpapInputHours(e.target.value)}
            placeholder="e.g., 5.5"
            required
          />
        </div>

        {/* Right-aligned submit button */}
        <div className="form-actions right">
          <button onClick={handleCpapAdd}>Add to Chart</button>
        </div>

        {/* Left-aligned toggle button */}
        <div className="form-actions left">
          <button onClick={() => setShowCpapHistory(prev => !prev)}>
            {showCpapHistory ? 'Hide CPAP History' : 'Show CPAP History'}
          </button>
        </div>

        {/* History List */}
        {showCpapHistory && (
          <div className="history-section">
            <h5>Recent CPAP Entries:</h5>
            <ul>
              {cpapData.slice().reverse().slice(0, 5).map((entry, idx) => (
                <li key={idx}>
                  <strong>{entry.date}</strong>: {entry.hours} hrs
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

  const renderInsightsTab = () => (
  <div className="tab-content" role="region" aria-labelledby="insights-heading">
    <h3 id="insights-heading">Weekly Insights</h3>

    <div className="chart-instructions" role="region" aria-labelledby="instructions-heading">
      <h4 id="instructions-heading">Instructions</h4>
      <ul role="list">
        <li role="listitem">Compliance threshold: {threshold} hours/day.</li>
        <li role="listitem">Days below threshold are marked as alerts.</li>
        <li role="listitem">Chart shows usage over time with a reference line at threshold.</li>
      </ul>
    </div>

    {lowUsage.length > 0 && (
      <div className="alert-box" role="region" aria-labelledby="alerts-heading">
        <h4 id="alerts-heading">Alerts</h4>
        <ul role="list">
          {(showAllAlerts ? lowUsage : lowUsage.slice(0, 1)).map((entry, index) => (
            <li key={index} role="listitem">
              <strong>{entry.date}</strong>: {entry.hours} hrs
            </li>
          ))}
        </ul>
        {lowUsage.length > 1 && (
          <button
            onClick={() => setShowAllAlerts(!showAllAlerts)}
            aria-label={showAllAlerts ? "Collapse alert list" : "Expand alert list"}
          >
            {showAllAlerts ? 'Collapse' : 'View Full'}
          </button>
        )}
      </div>
    )}

    <div role="img" aria-label="Line chart showing CPAP usage over time">
      <BehaviorChart data={cpapData} mode={mode} />
    </div>
  </div>
);

  const renderSettingsTab = () => (
  <div className="tab-content" role="region" aria-labelledby="settings-heading">
    <h3 id="settings-heading">⚙️ Device & Mode Settings</h3>
    <p>Choose your device and adjust your monitoring mode:</p>
    <ul role="list">
      <li role="listitem"><strong>Standard:</strong> Uses a 4-hour compliance threshold. Best for typical users.</li>
      <li role="listitem"><strong>Auto:</strong> Also uses 4 hours but allows future automation.</li>
      <li role="listitem"><strong>Boost:</strong> Requires 6 hours per night to promote higher adherence.</li>
    </ul>

    <div className="form-group">
      <label htmlFor="deviceSelect">Device</label>
      <select
        id="deviceSelect"
        value={selectedDevice}
        onChange={(e) => setSelectedDevice(e.target.value)}
        aria-label="Select CPAP device"
      >
        <option value="">-- Choose a device --</option>
        <option value="ResMed AirSense 10">ResMed AirSense 10</option>
        <option value="Philips DreamStation">Philips DreamStation</option>
        <option value="CPAP Pro A7">CPAP Pro A7</option>
      </select>
      <button onClick={handleDeviceSave} aria-label={`Save selected device: ${selectedDevice || 'None'}`}>Save Device</button>
    </div>

    <div className="modes" role="group" aria-label="Mode selection buttons">
      {['standard', 'auto', 'boost'].map(m => (
        <button
          key={m}
          onClick={() => handleSwitch(m)}
          disabled={mode === m}
          aria-label={`Switch to ${m} mode${mode === m ? ', currently selected' : ''}`}
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
          }}
        >
          {m.charAt(0).toUpperCase() + m.slice(1)}
        </button>
      ))}
      <span aria-live="polite">🟢 Current Mode: <strong>{mode}</strong></span>
    </div>
  </div>
);

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
    { name: 'Non-compliant', count: cpapData.filter(d => d.hours < threshold).length }
  ];

  return (
    <div className="tab-content" role="region" aria-labelledby="report-heading">
      <h3 id="report-heading">Report Summary</h3>
      <p>
        <strong>What is Compliance Rate?</strong><br />
        The compliance rate is the percentage of nights where your CPAP usage met the threshold: <strong>{threshold} hrs/night</strong>.
        It’s used to gauge your consistency and treatment success.
      </p>

      <div className="summary-grid">
        <div className="summary-item"><span>Low Usage Days:</span><strong>{cpapData.filter(d => d.hours < threshold).length}</strong></div>
        <div className="summary-item"><span>Compliance Rate:</span><strong>{isNaN(compliance) ? '0%' : `${compliance}%`}</strong></div>
        <div className="summary-item"><span>Average Daily Usage:</span><strong>{avgUsage} hrs</strong></div>
        <div className="summary-item"><span>Longest Streak:</span><strong>{maxStreak} days</strong></div>
        <div className="summary-item"><span>Most Common Symptom:</span><strong>{topSymptoms[0]?.[0] || 'None'} ({topSymptoms[0]?.[1] || 0} times)</strong></div>
        <div className="summary-item"><span>Symptoms by Severity:</span>
          <strong>
            Mild ({severityCount.Mild}), Moderate ({severityCount.Moderate}), Severe ({severityCount.Severe})
          </strong>
        </div>
        <div className="summary-item"><span>Severe Symptoms Reported:</span><strong>{severeCount}</strong></div>
        <div className="summary-item"><span>Total Symptoms:</span><strong>{symptomEntries.length}</strong></div>
        <div className="summary-item"><span>Data Points:</span><strong>{cpapData.length}</strong></div>
        <div className="summary-item"><span>First Use Date:</span><strong>{firstDate}</strong></div>
        <div className="summary-item"><span>Last Input Date:</span><strong>{lastDate}</strong></div>
        <div className="summary-item"><span>Current Mode:</span><strong>{mode}</strong></div>
        <div className="summary-item"><span>Selected Device:</span><strong>{selectedDevice || 'N/A'}</strong></div>
      </div>

      <h4 id="symptom-chart-title" className="report-section">Symptoms Distribution</h4>
      <div role="img" aria-labelledby="symptom-chart-title" aria-label="Pie chart showing distribution of symptom severity">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
              <Cell fill="#82ca9d" />
              <Cell fill="#8884d8" />
              <Cell fill="#ff7f7f" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <h4 id="compliance-bar-title" className="report-section">Compliance Overview</h4>
      <div role="img" aria-labelledby="compliance-bar-title" aria-label="Bar chart showing number of compliant and non-compliant days">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4ea8de" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h4 id="usage-line-title" className="report-section">Usage Over Time</h4>
      <div role="img" aria-labelledby="usage-line-title" aria-label="Line chart showing CPAP usage over time">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={sortedDates}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="hours" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

  return (
    <div className="behavior-container" role="main">
      <h1>Behavior Tracker And Analysis</h1>
      <p className="subtitle">Track symptoms, CPAP usage, and explore insights</p>

      <div className="tab-bar" role="tablist" aria-label="Behavior tracker navigation tabs">
        <button
          className={activeTab === 'Insights' ? 'active' : ''}
          onClick={() => setActiveTab('Insights')}
          role="tab"
          aria-selected={activeTab === 'Insights'}
          aria-controls="insights-panel"
          id="insights-tab"
        >
          Insights
        </button>
        <button
          className={activeTab === 'Input' ? 'active' : ''}
          onClick={() => setActiveTab('Input')}
          role="tab"
          aria-selected={activeTab === 'Input'}
          aria-controls="input-panel"
          id="input-tab"
        >
          Input
        </button>
        <button
          className={activeTab === 'Settings' ? 'active' : ''}
          onClick={() => setActiveTab('Settings')}
          role="tab"
          aria-selected={activeTab === 'Settings'}
          aria-controls="settings-panel"
          id="settings-tab"
        >
          Settings
        </button>
        <button
          className={activeTab === 'Report' ? 'active' : ''}
          onClick={() => setActiveTab('Report')}
          role="tab"
          aria-selected={activeTab === 'Report'}
          aria-controls="report-panel"
          id="report-tab"
        >
          Report
        </button>
      </div>

      <div
        id="insights-panel"
        role="tabpanel"
        aria-labelledby="insights-tab"
        hidden={activeTab !== 'Insights'}
      >
        {activeTab === 'Insights' && renderInsightsTab()}
      </div>
      <div
        id="input-panel"
        role="tabpanel"
        aria-labelledby="input-tab"
        hidden={activeTab !== 'Input'}
      >
        {activeTab === 'Input' && renderInputTab()}
      </div>
      <div
        id="settings-panel"
        role="tabpanel"
        aria-labelledby="settings-tab"
        hidden={activeTab !== 'Settings'}
      >
        {activeTab === 'Settings' && renderSettingsTab()}
      </div>
      <div
        id="report-panel"
        role="tabpanel"
        aria-labelledby="report-tab"
        hidden={activeTab !== 'Report'}
      >
        {activeTab === 'Report' && renderReportTab()}
      </div>
    </div>
  );
};

export default Tracker;

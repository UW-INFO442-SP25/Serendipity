import React, { useState } from 'react';
import BehaviorChart from './BehaviorChart';
import './tracker.css';
import { defaultCPAPData } from '../../data/cpapData';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ResponsiveContainer
} from 'recharts';

const Tracker = () => {
  const [activeTab, setActiveTab] = useState('Insights');
  const [cpapData, setCpapData] = useState(defaultCPAPData);
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

  const handleSymptomSubmit = () => {
    if (!symptom.trim()) return;
    const newEntry = {
      symptom,
      severity,
      date: new Date().toISOString().slice(0, 10)
    };
    setSymptomEntries([...symptomEntries, newEntry]);
    setSymptom('');
    setSeverity('Mild');
  };

  const handleCpapAdd = () => {
    if (!cpapInputDate || !cpapInputHours) {
      alert('Please enter both date and usage hours.');
      return;
    }
    const newEntry = { date: cpapInputDate, hours: parseFloat(cpapInputHours) };
    setCpapData([...cpapData, newEntry]);
    setCpapInputDate('');
    setCpapInputHours('');
  };

  const handleDeviceSave = () => {
    if (!selectedDevice) return;
    alert(`Device "${selectedDevice}" saved (simulated)`);
  };

  const handleSwitch = (newMode) => {
    setMode(newMode);
    alert(`Mode switched to "${newMode}" (simulated)`);
  };

  const renderInputTab = () => (
  <div className="tab-content">
    <h3>Symptom Tracker</h3>
    <input
      type="text"
      value={symptom}
      onChange={(e) => setSymptom(e.target.value)}
      placeholder="Symptom"
    />
    <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
      <option>Mild</option>
      <option>Moderate</option>
      <option>Severe</option>
    </select>
    <button onClick={handleSymptomSubmit}>Submit</button>
    <p>Submitted: {symptomEntries.length} entries</p>

    <h3>CPAP Usage Input</h3>
    <input
      type="date"
      value={cpapInputDate}
      onChange={(e) => setCpapInputDate(e.target.value)}
    />
    <input
      type="number"
      value={cpapInputHours}
      onChange={(e) => setCpapInputHours(e.target.value)}
      placeholder="Usage Hours"
    />
    <button onClick={handleCpapAdd}>➕ Add to Chart</button>
  </div>
);


  const renderInsightsTab = () => (
  <div className="tab-content">
    <h3>Weekly Insights</h3>
    <div className="chart-instructions">
      <h4>Instructions</h4>
      <ul>
        <li><strong>Alert:</strong> Triggered when CPAP usage is below {threshold} hours.</li>
      </ul>
    </div>

    {lowUsage.length > 0 && (
      <div className="alert-box" style={{ backgroundColor: '#fff5cc', padding: '1rem', borderRadius: '12px', marginTop: '1rem' }}>
        <h4>Alerts</h4>
        <ul>
          {(showAllAlerts ? lowUsage : lowUsage.slice(0, 1)).map((entry, index) => (
            <li key={index}><strong>{entry.date}</strong>: {entry.hours} hrs</li>
          ))}
        </ul>
        {lowUsage.length > 1 && (
          <button
            onClick={() => setShowAllAlerts(!showAllAlerts)}
            style={{
              marginTop: '0.5rem',
              background: '#1a73e8',
              color: 'white',
              border: 'none',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            {showAllAlerts ? 'Collapse' : 'View Full'}
          </button>
        )}
      </div>
    )}

    <BehaviorChart data={cpapData} mode={mode} />
  </div>
);


  const renderSettingsTab = () => (
  <div className="tab-content">
    <h3>⚙️ Device & Mode Settings</h3>

    <label>Device:
      <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)}>
        <option value="">-- Choose a device --</option>
        <option value="ResMed AirSense 10">ResMed AirSense 10</option>
        <option value="Philips DreamStation">Philips DreamStation</option>
        <option value="CPAP Pro A7">CPAP Pro A7</option>
      </select>
      <button
        onClick={handleDeviceSave}
        style={{
          marginLeft: '1rem',
          background: '#1a73e8',
          color: 'white',
          border: 'none',
          padding: '0.4rem 1rem',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Save Device
      </button>
    </label>

    <div className="modes" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      {['standard', 'auto', 'boost'].map(m => (
        <button
          key={m}
          onClick={() => handleSwitch(m)}
          disabled={mode === m}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '30px',
            background: mode === m ? '#1a73e8' : '#f1f1f1',
            color: mode === m ? '#fff' : '#333',
            border: 'none',
            fontWeight: 500,
            cursor: mode === m ? 'default' : 'pointer',
            opacity: mode === m ? 1 : 0.8,
            boxShadow: mode === m ? '0 2px 6px rgba(0,0,0,0.2)' : 'none',
            transition: 'background 0.3s'
          }}
        >
          {m.charAt(0).toUpperCase() + m.slice(1)}
        </button>
      ))}
      <span style={{ marginLeft: '1rem' }}>🟢 Current Mode: <strong>{mode}</strong></span>
    </div>

    <div className="mode-instructions" style={{ marginTop: '1.5rem', color: '#555' }}>
      <h4>Mode Instructions</h4>
      <ul style={{ paddingLeft: '1.2rem' }}>
        <li><strong>Standard:</strong> Default mode with a 4-hour compliance threshold. Best for general monitoring.</li>
        <li><strong>Auto:</strong> Also uses a 4-hour threshold, but allows future smart automation (e.g., alerts, auto-adjust).</li>
        <li><strong>Boost:</strong> Uses a stricter 6-hour threshold to encourage higher adherence.</li>
      </ul>
    </div>

    <div className="setting-reminder" style={{ marginTop: '1.5rem', color: '#555' }}>
      <h4>Additional Notes</h4>
      <ul style={{ paddingLeft: '1.2rem' }}>
        <li><strong>Device:</strong> This selection is referenced when generating CPAP reports and may affect compatibility logic.</li>
        <li><strong>Mode:</strong> Affects compliance threshold (Boost = 6 hrs, others = 4 hrs) and visual chart feedback.</li>
      </ul>
    </div>
  </div>
);

  const renderReportTab = () => {
    const totalHours = cpapData.reduce((sum, d) => sum + d.hours, 0);
    const avgUsage = (cpapData.length > 0) ? (totalHours / cpapData.length).toFixed(1) : 0;
    const sortedDates = [...cpapData].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstDate = sortedDates[0]?.date || 'N/A';
    const lastDate = sortedDates[sortedDates.length - 1]?.date || 'N/A';
    const severityCount = { Mild: 0, Moderate: 0, Severe: 0 };
    symptomEntries.forEach(entry => { severityCount[entry.severity]++; });

    let streak = 0, maxStreak = 0;
    for (let i = 0; i < sortedDates.length; i++) {
      if (sortedDates[i].hours >= threshold) {
        streak++;
        if (streak > maxStreak) maxStreak = streak;
      } else {
        streak = 0;
      }
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

    return (
      <div className="tab-content">
        <h3>Report Summary</h3>
        <p style={{ marginTop: '0.5rem', color: '#555' }}>
          <strong>What is Compliance Rate?</strong><br />
          Compliance Rate shows the percentage of days where your CPAP usage met the required threshold
          (<strong>{threshold} hours/day</strong>).<br />
          The threshold is <strong>4 hours/day</strong> in <em>Standard</em> or <em>Auto</em> mode,
          and <strong>6 hours/day</strong> in <em>Boost</em> mode.<br />
          A higher compliance rate usually means better treatment outcomes.
        </p>

        <ul>
          <li>Low Usage Days (&lt; {threshold} hrs): {lowUsage.length}</li>
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
              <Cell fill="#82ca9d" />
              <Cell fill="#8884d8" />
              <Cell fill="#ff7f7f" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <h4>Compliance Overview</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4ea8de" />
          </BarChart>
        </ResponsiveContainer>

        <h4>Usage Over Time</h4>
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
    );
  };

  return (
    <div className="behavior-container">
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
    </div>
  );
};

export default Tracker;

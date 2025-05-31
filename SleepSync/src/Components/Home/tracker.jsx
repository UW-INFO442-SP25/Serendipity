import React, { useState } from 'react'
import BehaviorChart from './BehaviorChart'
import './tracker.css'
import { defaultCPAPData } from '../../data/cpapData'

const Tracker = () => {
  const [activeTab, setActiveTab] = useState('CPAP')
  const [rightPanel, setRightPanel] = useState(null)
  const [selectedDevice, setSelectedDevice] = useState('')
  const [mode, setMode] = useState('standard')
  const [cpapData, setCpapData] = useState(defaultCPAPData)
  const [cpapInputDate, setCpapInputDate] = useState('')
  const [cpapInputHours, setCpapInputHours] = useState('')
  const [symptom, setSymptom] = useState('')
  const [severity, setSeverity] = useState('Mild')
  const [symptomEntries, setSymptomEntries] = useState([])

  const handleSymptomSubmit = () => {
    if (!symptom.trim()) return
    const newEntry = {
      symptom,
      severity,
      date: new Date().toISOString().slice(0, 10)
    }
    setSymptomEntries([...symptomEntries, newEntry])
    setSymptom('')
    setSeverity('Mild')
  }

  const handleTriggerAlert = () => {
    const lowUsage = cpapData.filter(d => d.hours < 4)
    alert(`🚨 ${lowUsage.length} nights with low CPAP usage (< 4hrs) detected.`)
  }

  const handleDeviceSave = () => {
    if (!selectedDevice) return
    alert(`💾 Device "${selectedDevice}" saved (simulated)`)
  }

  const handleSwitch = (newMode) => {
    setMode(newMode)
    alert(`🔁 Mode switched to "${newMode}" (simulated)`)
  }

  const handleCpapAdd = () => {
    if (!cpapInputDate || !cpapInputHours) {
      alert('❗ Please enter both date and usage hours.')
      return
    }
    const newEntry = { date: cpapInputDate, hours: parseFloat(cpapInputHours) }
    setCpapData([...cpapData, newEntry])
    setCpapInputDate('')
    setCpapInputHours('')
  }

  const renderRightPanel = () => {
    if (rightPanel === 'alert') {
      const lowUsage = cpapData.filter(d => d.hours < 4)
      return (
        <div className="tab-content">
          <h3>🚨 Alerts</h3>
          <button onClick={handleTriggerAlert}>Trigger Sample Alert</button>
          {lowUsage.length > 0 && (
            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
              {lowUsage.map((entry, index) => (
                <li key={index}>⚠️ <strong>{entry.date}</strong>: {entry.hours} hrs</li>
              ))}
            </ul>
          )}
        </div>
      )
    }

    if (rightPanel === 'device') {
      return (
        <div className="tab-content">
          <h3>💡 Select Device</h3>
          <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)}>
            <option value="">-- Choose a device --</option>
            <option value="ResMed AirSense 10">ResMed AirSense 10</option>
            <option value="Philips DreamStation">Philips DreamStation</option>
            <option value="CPAP Pro A7">CPAP Pro A7</option>
          </select>
          <button onClick={handleDeviceSave} disabled={!selectedDevice}>Save Device</button>
        </div>
      )
    }

    if (rightPanel === 'switch') {
      return (
        <div className="tab-content">
          <h3>🔁 Switch Mode</h3>
          <button onClick={() => handleSwitch('standard')}>Standard Mode</button>
          <button onClick={() => handleSwitch('auto')}>Auto Mode</button>
          <button onClick={() => handleSwitch('boost')}>Boost Mode</button>
          <p>🟢 Current Mode: <strong>{mode}</strong></p>
        </div>
      )
    }

    return null
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'CPAP':
        return <BehaviorChart data={cpapData} />

      case 'Symptom':
        return (
          <div className="tab-content symptom-form">
            <label>Symptom:
              <input
                type="text"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="e.g. Headache, Dry Mouth"
              />
            </label>
            <label>Severity:
              <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                <option>Mild</option>
                <option>Moderate</option>
                <option>Severe</option>
              </select>
            </label>
            <button onClick={handleSymptomSubmit}>Submit</button>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              Submitted: {symptomEntries.length} entries
            </p>
          </div>
        )

      case 'Factor':
        const lowCPAP = cpapData.filter(d => d.hours < 4)
        const symptomMap = {}
        symptomEntries.forEach(entry => {
          symptomMap[entry.symptom] = (symptomMap[entry.symptom] || 0) + 1
        })
        const topSymptoms = Object.entries(symptomMap).sort((a, b) => b[1] - a[1])
        return (
          <div className="tab-content">
            <h3>🧠 Factors Impacting Usage</h3>
            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>❌ Days with low usage (&lt; 4hrs): {lowCPAP.length}</li>
              {topSymptoms.length > 0 &&
                <li>🩺 Most common symptom: <strong>{topSymptoms[0][0]}</strong> ({topSymptoms[0][1]} times)</li>}
              {topSymptoms.length === 0 &&
                <li>🎉 No symptom data yet</li>}
            </ul>
          </div>
        )

      case 'Report':
        const severeCount = symptomEntries.filter(e => e.severity === 'Severe').length
        const uniqueSymptoms = [...new Set(symptomEntries.map(e => e.symptom))]
        const compliance = Math.round(cpapData.filter(d => d.hours >= 4).length / cpapData.length * 100)

        return (
          <div className="tab-content">
            <h3>📋 Weekly Report Summary</h3>
            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li><strong>Compliance Rate:</strong> {compliance}%</li>
              <li><strong>Total Symptoms Reported:</strong> {symptomEntries.length}</li>
              <li><strong>Severe Symptoms:</strong> {severeCount}</li>
              <li><strong>Symptom Types:</strong> {uniqueSymptoms.join(', ') || 'None'}</li>
            </ul>
          </div>
        )

      case 'Import':
        return (
          <div className="tab-content">
            <label><strong>📅 Date:</strong>
              <input
                type="date"
                value={cpapInputDate}
                onChange={(e) => setCpapInputDate(e.target.value)}
                style={{ marginLeft: '0.5rem', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </label>
            <br /><br />
            <label><strong>🕒 CPAP Usage (hrs):</strong>
              <input
                type="number"
                value={cpapInputHours}
                onChange={(e) => setCpapInputHours(e.target.value)}
                placeholder="e.g. 4.5"
                style={{ marginLeft: '0.5rem', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </label>
            <br /><br />
            <button
              onClick={handleCpapAdd}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#1a73e8',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              ➕ Add to Chart
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="behavior-container">
      <h1>Behavior Tracker And Analysis</h1>
      <p className="subtitle">Track the symptom and CPAP usage, and analyze the factors</p>

      <div className="tab-bar-with-buttons">
        <div className="tab-bar">
          <button className={activeTab === 'CPAP' ? 'active' : ''} onClick={() => { setActiveTab('CPAP'); setRightPanel(null) }}>CPAP Usage</button>
          <button className={activeTab === 'Symptom' ? 'active' : ''} onClick={() => { setActiveTab('Symptom'); setRightPanel(null) }}>Symptom Tracker</button>
          <button className={activeTab === 'Factor' ? 'active' : ''} onClick={() => { setActiveTab('Factor'); setRightPanel(null) }}>Factor Analysis</button>
          <button className={activeTab === 'Report' ? 'active' : ''} onClick={() => { setActiveTab('Report'); setRightPanel(null) }}>Result Report</button>
          <button className={activeTab === 'Import' ? 'active' : ''} onClick={() => { setActiveTab('Import'); setRightPanel(null) }}>Data Import</button>
        </div>
        <div className="right-buttons-inline">
          <button onClick={() => setRightPanel('alert')}>Alert</button>
          <button onClick={() => setRightPanel('device')}>Device</button>
          <button onClick={() => setRightPanel('switch')}>Switch</button>
        </div>
      </div>

      {renderRightPanel()}
      {renderContent()}
    </div>
  )
}

export default Tracker;

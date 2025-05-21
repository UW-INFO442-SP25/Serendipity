import React, { useState } from 'react'
import BehaviorChart from './BehaviorChart'
import SymptomForm from './SymptomForm'
import './tracker.css'
import { db } from '../../firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

const Tracker = () => {
  const [activeTab, setActiveTab] = useState('CPAP')
  const [rightPanel, setRightPanel] = useState(null)
  const [selectedDevice, setSelectedDevice] = useState('')
  const [mode, setMode] = useState('standard')

  const handleTriggerAlert = async () => {
    await addDoc(collection(db, 'alerts'), {
      type: 'Low CPAP usage',
      createdAt: Timestamp.now(),
      resolved: false
    })
    alert('🚨 Alert has been saved to Firestore!')
  }

  const handleDeviceSave = async () => {
    if (!selectedDevice) return
    await addDoc(collection(db, 'devices'), {
      name: selectedDevice,
      user: 'testUser123',
      savedAt: Timestamp.now()
    })
    alert(`💾 Device "${selectedDevice}" saved to Firestore`)
  }

  const handleSwitch = async (newMode) => {
    setMode(newMode)
    await addDoc(collection(db, 'switches'), {
      mode: newMode,
      switchedAt: Timestamp.now()
    })
    alert(`🔁 Mode switched to "${newMode}" and saved to Firestore`)
  }

  const renderContent = () => {
    if (rightPanel === 'alert') {
      return (
        <div className="tab-content">
          <h3>🚨 Alerts</h3>
          <button onClick={handleTriggerAlert}>Trigger Sample Alert</button>
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
          <button onClick={handleDeviceSave} disabled={!selectedDevice}>
            Save Device
          </button>
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

    // fallback to tab content
    switch (activeTab) {
      case 'CPAP':
        return <BehaviorChart />
      case 'Symptom':
        return <SymptomForm />
      case 'Factor':
        return <p className="tab-content">📊 Factor analysis placeholder content.</p>
      case 'Report':
        return <p className="tab-content">📝 Your result report will be shown here.</p>
      case 'Import':
        return <p className="tab-content">📂 Upload or sync external data here.</p>
      default:
        return null
    }
  }

  return (
    <div className="behavior-container">
      <h1>Behavior Tracker And Analysis</h1>
      <p className="subtitle">Track the symptom and CPAP usage, and analyze the factors</p>

      <div className="tab-bar">
        <button className={activeTab === 'CPAP' ? 'active' : ''} onClick={() => { setActiveTab('CPAP'); setRightPanel(null) }}>CPAP Usage</button>
        <button className={activeTab === 'Symptom' ? 'active' : ''} onClick={() => { setActiveTab('Symptom'); setRightPanel(null) }}>Symptom Tracker</button>
        <button className={activeTab === 'Factor' ? 'active' : ''} onClick={() => { setActiveTab('Factor'); setRightPanel(null) }}>Factor Analysis</button>
        <button className={activeTab === 'Report' ? 'active' : ''} onClick={() => { setActiveTab('Report'); setRightPanel(null) }}>Result Report</button>
        <button className={activeTab === 'Import' ? 'active' : ''} onClick={() => { setActiveTab('Import'); setRightPanel(null) }}>Data Import</button>
      </div>

      {renderContent()}

      <div className="right-buttons">
        <button onClick={() => setRightPanel('alert')}>Alert</button>
        <button onClick={() => setRightPanel('device')}>Device</button>
        <button onClick={() => setRightPanel('switch')}>Switch</button>
      </div>
    </div>
  )
}

export default Tracker

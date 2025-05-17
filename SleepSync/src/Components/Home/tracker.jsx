import React, { useState } from 'react'
import BehaviorChart from './BehaviorChart'
import SymptomForm from './SymptomForm'
import './tracker.css'

const Tracker = () => {
  const [activeTab, setActiveTab] = useState('CPAP')

  const renderContent = () => {
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
        <button className={activeTab === 'CPAP' ? 'active' : ''} onClick={() => setActiveTab('CPAP')}>
          CPAP Usage
        </button>
        <button className={activeTab === 'Symptom' ? 'active' : ''} onClick={() => setActiveTab('Symptom')}>
          Symptom Tracker
        </button>
        <button className={activeTab === 'Factor' ? 'active' : ''} onClick={() => setActiveTab('Factor')}>
          Factor Analysis
        </button>
        <button className={activeTab === 'Report' ? 'active' : ''} onClick={() => setActiveTab('Report')}>
          Result Report
        </button>
        <button className={activeTab === 'Import' ? 'active' : ''} onClick={() => setActiveTab('Import')}>
          Data Import
        </button>
      </div>

      {renderContent()}

      <div className="right-buttons">
        <button>Alert</button>
        <button>Device</button>
        <button>Switch</button>
      </div>
    </div>
  )
}

export default Tracker

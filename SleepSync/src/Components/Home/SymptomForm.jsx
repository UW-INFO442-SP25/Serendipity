import React, { useState } from 'react'
import './tracker.css'
import { db } from '../../firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

const SymptomForm = () => {
  const [symptom, setSymptom] = useState('')
  const [severity, setSeverity] = useState('mild')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, "symptoms"), {
        symptom,
        severity,
        timestamp: Timestamp.now()
      })
      setSubmitted(true)
      setSymptom('')
      setSeverity('mild')
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setError("Failed to submit. Please try again.")
      console.error("Error writing to Firestore:", err)
    }
  }

  return (
    <form className="symptom-form" onSubmit={handleSubmit}>
      <label>
        Symptom:
        <input
          type="text"
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          placeholder="e.g. Headache, Dry Mouth"
          required
        />
      </label>

      <label>
        Severity:
        <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>
      </label>

      <button type="submit">Submit</button>

      {submitted && <p className="success-message">Symptom submitted to Firebase!</p>}
      {error && <p className="error-message">❌ {error}</p>}
    </form>
  )
}

export default SymptomForm

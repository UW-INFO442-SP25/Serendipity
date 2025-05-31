import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Label
} from 'recharts'

function BehaviorChart({ data }) {
  return (
    <div className="chart-wrapper">
      <h3 style={{ marginBottom: '1rem' }}>CPAP Usage Tracking</h3>

      {/* Instruction Section */}
      <div
        className="chart-instructions"
        style={{
          backgroundColor: '#f9f9f9',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          maxWidth: '800px'
        }}
      >
        <h4 style={{ marginTop: 0, fontWeight: '600' }}>Instructions</h4>
        <ul style={{ marginLeft: '1.5rem', color: '#444', lineHeight: 1.6 }}>
          <li><strong>Alert:</strong> Trigger alerts when CPAP usage drops too low.</li>
          <li><strong>Device:</strong> Select and save your CPAP device model.</li>
          <li><strong>Switch:</strong> Change between standard / auto / boost modes.</li>
        </ul>
      </div>

      {/* Chart Section */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'Usage Hours', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="hours"
            name="CPAP Usage (hrs)"
            stroke="#f7aa0c"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <ReferenceLine y={4} stroke="gray" strokeDasharray="5 5">
            <Label position="right" value="Compliance Threshold (4 hrs)" />
          </ReferenceLine>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BehaviorChart

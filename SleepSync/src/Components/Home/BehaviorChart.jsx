import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Label
} from 'recharts'

function BehaviorChart({ data, mode }) {
  // Determine compliance threshold based on mode
  const threshold = mode === 'boost' ? 6 : 4
  const modeColor = {
    standard: '#f7aa0c',
    auto: '#8884d8',
    boost: '#4caf50'
  }

  return (
    <div className="chart-wrapper">
      <h3 style={{ marginBottom: '1rem' }}>CPAP Usage Tracking</h3>

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
            stroke={modeColor[mode] || '#f7aa0c'}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <ReferenceLine y={threshold} stroke="gray" strokeDasharray="5 5">
            <Label position="right" value={`Compliance Threshold (${threshold} hrs)`} />
          </ReferenceLine>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BehaviorChart
import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label
} from 'recharts'

const data = [
  { date: '2025-04-01', hours: 5 },
  { date: '2025-04-02', hours: 0 },
  { date: '2025-04-03', hours: 5.5 },
  { date: '2025-04-04', hours: 6.1 },
  { date: '2025-04-05', hours: 2.5 },
  { date: '2025-04-06', hours: 0 },
  { date: '2025-04-07', hours: 7 },
  { date: '2025-04-08', hours: 5.5 },
  { date: '2025-04-09', hours: 0 },
  { date: '2025-04-10', hours: 6.8 },
  { date: '2025-04-11', hours: 4 },
  { date: '2025-04-12', hours: 5.2 },
  { date: '2025-04-13', hours: 0 },
  { date: '2025-04-14', hours: 5.9 },
]

function BehaviorChart() {
  return (
    <div className="chart-wrapper">
      <h3>CPAP Usage Tracking (April 1–14, 2025)</h3>
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

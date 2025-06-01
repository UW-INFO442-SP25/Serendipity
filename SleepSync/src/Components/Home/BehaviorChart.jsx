import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label
} from 'recharts';

function BehaviorChart({ data }) {
  // ✅ 按照日期升序排序
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="chart-wrapper">
      <h3 style={{ marginBottom: '1rem' }}>CPAP Usage Tracking</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sortedData}>
          <XAxis dataKey="date" />
          <YAxis
            label={{ value: 'Usage Hours', angle: -90, position: 'insideLeft' }}
          />
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
  );
}

export default BehaviorChart;

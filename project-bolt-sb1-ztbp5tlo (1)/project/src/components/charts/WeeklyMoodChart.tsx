import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface MoodDataPoint {
  date: string;
  value: number;
  label: string;
}

interface WeeklyMoodChartProps {
  data: MoodDataPoint[];
}

export const WeeklyMoodChart: React.FC<WeeklyMoodChartProps> = ({ data }) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="font-semibold text-blue-600">
            {dataPoint.label}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            domain={[1, 5]} 
            ticks={[1, 2, 3, 4, 5]} 
            tickFormatter={(value) => {
              const labels = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
              return labels[value - 1];
            }}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={3} stroke="#E5E7EB" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#4A90E2" 
            strokeWidth={2}
            dot={{ stroke: '#4A90E2', strokeWidth: 2, r: 4, fill: '#FFFFFF' }}
            activeDot={{ r: 6, stroke: '#4A90E2', strokeWidth: 2, fill: '#4A90E2' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChallengeResult } from '../types';
import { format } from 'date-fns';

interface PerformanceChartProps {
  challengeResults: ChallengeResult[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ challengeResults }) => {
  const chartData = challengeResults
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((result, index) => ({
      name: format(result.date, 'MMM dd'),
      score: result.score,
      challenge: result.challengeTitle,
      index: index + 1
    }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1d1d1" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#78716c', fontWeight: 500 }}
          />
          <YAxis 
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#78716c', fontWeight: 500 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e7e5e4',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              fontWeight: 500
            }}
            formatter={(value, name) => [`${value}%`, 'Score']}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return payload[0].payload.challenge;
              }
              return label;
            }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="url(#colorGradient)" 
            strokeWidth={4}
            dot={{ fill: '#6115D0', strokeWidth: 3, r: 6 }}
            activeDot={{ r: 8, stroke: '#6115D0', strokeWidth: 3, fill: '#F25251' }}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6115D0" />
              <stop offset="100%" stopColor="#F25251" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
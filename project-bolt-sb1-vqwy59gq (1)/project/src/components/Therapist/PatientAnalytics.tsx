import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Session, EmotionData } from '../../types';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface PatientAnalyticsProps {
  sessions: Session[];
}

const PatientAnalytics: React.FC<PatientAnalyticsProps> = ({ sessions }) => {
  // Prepare risk score trend data
  const riskTrendData = sessions
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .map((session, index) => ({
      session: `Session ${index + 1}`,
      riskScore: session.riskScore,
      date: new Date(session.startTime).toLocaleDateString()
    }));

  // Prepare emotion distribution data
  const emotionCounts = sessions.reduce((acc, session) => {
    session.emotionData.forEach((emotion: EmotionData) => {
      acc[emotion.emotion] = (acc[emotion.emotion] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const emotionData = Object.entries(emotionCounts).map(([emotion, count]) => ({
    emotion,
    count,
    percentage: Math.round((count / Object.values(emotionCounts).reduce((a, b) => a + b, 0)) * 100)
  }));

  const emotionColors = {
    happy: '#10B981',
    sad: '#3B82F6',
    angry: '#EF4444',
    surprised: '#F59E0B',
    fear: '#8B5CF6',
    disgust: '#F97316',
    neutral: '#6B7280'
  };

  // Calculate trends
  const avgRiskScore = sessions.length > 0 
    ? sessions.reduce((sum, s) => sum + s.riskScore, 0) / sessions.length 
    : 0;

  const recentSessions = sessions.slice(-5);
  const olderSessions = sessions.slice(0, -5);
  const recentAvgRisk = recentSessions.length > 0
    ? recentSessions.reduce((sum, s) => sum + s.riskScore, 0) / recentSessions.length
    : 0;
  const olderAvgRisk = olderSessions.length > 0
    ? olderSessions.reduce((sum, s) => sum + s.riskScore, 0) / olderSessions.length
    : 0;

  const riskTrend = recentAvgRisk - olderAvgRisk;

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No session data available for analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Risk Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(avgRiskScore)}%
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              avgRiskScore < 30 ? 'bg-therapeutic-100 text-therapeutic-600' :
              avgRiskScore < 70 ? 'bg-warning-100 text-warning-600' :
              'bg-danger-100 text-danger-600'
            }`}>
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Risk Trend</p>
              <p className={`text-2xl font-bold ${
                riskTrend < 0 ? 'text-therapeutic-600' : 'text-danger-600'
              }`}>
                {riskTrend > 0 ? '+' : ''}{Math.round(riskTrend)}%
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              riskTrend < 0 ? 'bg-therapeutic-100 text-therapeutic-600' : 'bg-danger-100 text-danger-600'
            }`}>
              {riskTrend < 0 ? <TrendingDown className="h-6 w-6" /> : <TrendingUp className="h-6 w-6" />}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
            </div>
            <div className="bg-primary-100 text-primary-600 p-3 rounded-lg">
              <PieChartIcon className="h-6 w-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Score Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Score Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="session" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="riskScore"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Emotion Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emotion Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ emotion, percentage }) => `${emotion} (${percentage}%)`}
                >
                  {emotionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={emotionColors[entry.emotion as keyof typeof emotionColors] || '#6B7280'} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Session Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Activity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="session" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="riskScore" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientAnalytics;
import React from 'react';
import { motion } from 'framer-motion';
import { Session } from '../../types';
import { Brain, TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface EmotionAnalysisProps {
  session: Session;
}

const EmotionAnalysis: React.FC<EmotionAnalysisProps> = ({ session }) => {
  // Emotion distribution
  const emotionCounts = session.emotionData.reduce((acc, emotion) => {
    acc[emotion.emotion] = (acc[emotion.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const emotionData = Object.entries(emotionCounts).map(([emotion, count]) => ({
    emotion,
    count,
    percentage: Math.round((count / session.emotionData.length) * 100)
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

  // Timeline data
  const timelineData = session.emotionData.map((emotion, index) => ({
    time: index + 1,
    intensity: emotion.intensity * 100,
    confidence: emotion.confidence * 100,
    emotion: emotion.emotion
  }));

  // Intensity distribution
  const intensityRanges = {
    low: session.emotionData.filter(e => e.intensity < 0.3).length,
    medium: session.emotionData.filter(e => e.intensity >= 0.3 && e.intensity < 0.7).length,
    high: session.emotionData.filter(e => e.intensity >= 0.7).length
  };

  const intensityData = [
    { range: 'Low (0-30%)', count: intensityRanges.low, color: '#10B981' },
    { range: 'Medium (30-70%)', count: intensityRanges.medium, color: '#F59E0B' },
    { range: 'High (70-100%)', count: intensityRanges.high, color: '#EF4444' }
  ];

  // Calculate metrics
  const avgIntensity = session.emotionData.length > 0 
    ? session.emotionData.reduce((sum, e) => sum + e.intensity, 0) / session.emotionData.length * 100
    : 0;

  const avgConfidence = session.emotionData.length > 0 
    ? session.emotionData.reduce((sum, e) => sum + e.confidence, 0) / session.emotionData.length * 100
    : 0;

  const negativeEmotions = session.emotionData.filter(e => 
    ['sad', 'angry', 'fear', 'disgust'].includes(e.emotion)
  ).length;

  const positiveEmotions = session.emotionData.filter(e => 
    ['happy', 'surprised'].includes(e.emotion)
  ).length;

  const emotionalBalance = session.emotionData.length > 0 
    ? ((positiveEmotions - negativeEmotions) / session.emotionData.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Brain className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{session.emotionData.length}</p>
              <p className="text-sm text-gray-600">Total Emotions</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className="bg-therapeutic-100 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-therapeutic-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{Math.round(avgIntensity)}%</p>
              <p className="text-sm text-gray-600">Avg Intensity</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className="bg-warning-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{Math.round(avgConfidence)}%</p>
              <p className="text-sm text-gray-600">Avg Confidence</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`bg-white rounded-xl shadow-sm p-6 border-2 ${
            emotionalBalance > 0 ? 'border-therapeutic-200' : 'border-danger-200'
          }`}
        >
          <div className="flex items-center">
            <div className={`${
              emotionalBalance > 0 ? 'bg-therapeutic-100' : 'bg-danger-100'
            } p-3 rounded-lg`}>
              {emotionalBalance > 0 ? (
                <TrendingUp className={`h-6 w-6 ${
                  emotionalBalance > 0 ? 'text-therapeutic-600' : 'text-danger-600'
                }`} />
              ) : (
                <TrendingDown className="h-6 w-6 text-danger-600" />
              )}
            </div>
            <div className="ml-4">
              <p className={`text-2xl font-bold ${
                emotionalBalance > 0 ? 'text-therapeutic-600' : 'text-danger-600'
              }`}>
                {emotionalBalance > 0 ? '+' : ''}{Math.round(emotionalBalance)}%
              </p>
              <p className="text-sm text-gray-600">Emotional Balance</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotion Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emotion Distribution</h3>
          {emotionData.length > 0 ? (
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
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No emotion data available
            </div>
          )}
        </motion.div>

        {/* Intensity Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Intensity Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intensityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Emotion Timeline */}
      {timelineData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emotion Intensity Timeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="intensity"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-primary-500"></div>
              <span className="text-sm text-gray-600">Intensity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-therapeutic-500 border-dashed"></div>
              <span className="text-sm text-gray-600">Confidence</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Detailed Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Emotion Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Emotion Breakdown</h4>
            <div className="space-y-3">
              {emotionData.map(emotion => (
                <div key={emotion.emotion} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: emotionColors[emotion.emotion as keyof typeof emotionColors] }}
                    />
                    <span className="capitalize font-medium">{emotion.emotion}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${emotion.percentage}%`,
                          backgroundColor: emotionColors[emotion.emotion as keyof typeof emotionColors]
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12">{emotion.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Key Insights</h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Most Frequent Emotion</p>
                <p className="text-sm text-gray-600 capitalize">
                  {emotionData.length > 0 ? emotionData.reduce((a, b) => a.count > b.count ? a : b).emotion : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Emotional Variability</p>
                <p className="text-sm text-gray-600">
                  {Object.keys(emotionCounts).length} different emotions detected
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Positive vs Negative</p>
                <p className="text-sm text-gray-600">
                  {positiveEmotions} positive, {negativeEmotions} negative emotions
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">High Intensity Episodes</p>
                <p className="text-sm text-gray-600">
                  {intensityRanges.high} emotions with intensity {'>'} 70%
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmotionAnalysis;
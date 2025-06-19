import React from 'react';
import { motion } from 'framer-motion';
import { Session } from '../../types';
import { Calendar, Clock, User, AlertTriangle, Brain, MessageCircle, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface SessionOverviewProps {
  session: Session;
}

const SessionOverview: React.FC<SessionOverviewProps> = ({ session }) => {
  const duration = session.endTime 
    ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000)
    : 'Ongoing';

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

  // Voice sentiment distribution
  const sentimentCounts = session.voiceData.reduce((acc, voice) => {
    acc[voice.sentiment] = (acc[voice.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sentimentData = Object.entries(sentimentCounts).map(([sentiment, count]) => ({
    sentiment,
    count,
    percentage: Math.round((count / session.voiceData.length) * 100)
  }));

  // Timeline data
  const timelineData = session.emotionData
    .slice(0, 10)
    .map((emotion, index) => ({
      time: `${index + 1}`,
      intensity: emotion.intensity * 100,
      confidence: emotion.confidence * 100
    }));

  const getRiskLevel = (score: number) => {
    if (score > 80) return { level: 'Critical', color: 'danger', description: 'Immediate intervention required' };
    if (score > 60) return { level: 'High', color: 'warning', description: 'Close monitoring needed' };
    if (score > 30) return { level: 'Moderate', color: 'primary', description: 'Regular check-ins recommended' };
    return { level: 'Low', color: 'therapeutic', description: 'Stable condition' };
  };

  const riskLevel = getRiskLevel(session.riskScore);

  return (
    <div className="space-y-6">
      {/* Session Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{duration}</p>
              <p className="text-sm text-gray-600">Duration (min)</p>
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
              <Brain className="h-6 w-6 text-therapeutic-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{session.emotionData.length}</p>
              <p className="text-sm text-gray-600">Emotions Detected</p>
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
            <div className="bg-primary-100 p-3 rounded-lg">
              <MessageCircle className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{session.voiceData.length}</p>
              <p className="text-sm text-gray-600">Voice Interactions</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`bg-white rounded-xl shadow-sm p-6 border-2 border-${riskLevel.color}-200`}
        >
          <div className="flex items-center">
            <div className={`bg-${riskLevel.color}-100 p-3 rounded-lg`}>
              <AlertTriangle className={`h-6 w-6 text-${riskLevel.color}-600`} />
            </div>
            <div className="ml-4">
              <p className={`text-2xl font-bold text-${riskLevel.color}-600`}>
                {Math.round(session.riskScore)}%
              </p>
              <p className="text-sm text-gray-600">Risk Score</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Risk Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r from-${riskLevel.color}-50 to-white rounded-xl p-6 border border-${riskLevel.color}-200`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xl font-bold text-${riskLevel.color}-700`}>
              {riskLevel.level} Risk Level
            </h3>
            <p className="text-gray-600 mt-1">{riskLevel.description}</p>
          </div>
          <div className={`bg-${riskLevel.color}-100 p-4 rounded-full`}>
            <AlertTriangle className={`h-8 w-8 text-${riskLevel.color}-600`} />
          </div>
        </div>
      </motion.div>

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

        {/* Voice Sentiment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Sentiment Analysis</h3>
          {sentimentData.length > 0 ? (
            <div className="space-y-4">
              {sentimentData.map(sentiment => (
                <div key={sentiment.sentiment} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      sentiment.sentiment === 'positive' ? 'bg-therapeutic-500' :
                      sentiment.sentiment === 'negative' ? 'bg-danger-500' :
                      'bg-gray-500'
                    }`} />
                    <span className="capitalize font-medium">{sentiment.sentiment}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          sentiment.sentiment === 'positive' ? 'bg-therapeutic-500' :
                          sentiment.sentiment === 'negative' ? 'bg-danger-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width: `${sentiment.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{sentiment.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-500">
              No voice data available
            </div>
          )}
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
              <BarChart data={timelineData}>
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
                <Bar dataKey="intensity" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Session Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Patient ID:</span>
                <span className="font-medium">{session.patientId.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Start Time:</span>
                <span className="font-medium">{new Date(session.startTime).toLocaleString()}</span>
              </div>
              {session.endTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">End Time:</span>
                  <span className="font-medium">{new Date(session.endTime).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Session ID:</span>
                <span className="font-medium font-mono text-xs">{session.id}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Data Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Emotions:</span>
                <span className="font-medium">{session.emotionData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Voice Samples:</span>
                <span className="font-medium">{session.voiceData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Confidence:</span>
                <span className="font-medium">
                  {session.emotionData.length > 0 
                    ? Math.round(session.emotionData.reduce((sum, e) => sum + e.confidence, 0) / session.emotionData.length * 100)
                    : 0
                  }%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Risk Level:</span>
                <span className={`font-medium text-${riskLevel.color}-600`}>{riskLevel.level}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SessionOverview;
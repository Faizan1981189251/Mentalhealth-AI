import React from 'react';
import { motion } from 'framer-motion';
import { Session } from '../../types';
import { MessageCircle, TrendingUp, TrendingDown, Activity, Volume2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface VoiceAnalysisProps {
  session: Session;
}

const VoiceAnalysis: React.FC<VoiceAnalysisProps> = ({ session }) => {
  // Sentiment distribution
  const sentimentCounts = session.voiceData.reduce((acc, voice) => {
    acc[voice.sentiment] = (acc[voice.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sentimentData = Object.entries(sentimentCounts).map(([sentiment, count]) => ({
    sentiment,
    count,
    percentage: Math.round((count / session.voiceData.length) * 100)
  }));

  const sentimentColors = {
    positive: '#10B981',
    negative: '#EF4444',
    neutral: '#6B7280'
  };

  // Stress level timeline
  const stressTimelineData = session.voiceData.map((voice, index) => ({
    time: index + 1,
    stress: voice.stressLevel * 100,
    confidence: voice.confidence * 100
  }));

  // Confidence distribution
  const confidenceRanges = {
    low: session.voiceData.filter(v => v.confidence < 0.6).length,
    medium: session.voiceData.filter(v => v.confidence >= 0.6 && v.confidence < 0.8).length,
    high: session.voiceData.filter(v => v.confidence >= 0.8).length
  };

  const confidenceData = [
    { range: 'Low (0-60%)', count: confidenceRanges.low, color: '#EF4444' },
    { range: 'Medium (60-80%)', count: confidenceRanges.medium, color: '#F59E0B' },
    { range: 'High (80-100%)', count: confidenceRanges.high, color: '#10B981' }
  ];

  // Calculate metrics
  const avgStress = session.voiceData.length > 0 
    ? session.voiceData.reduce((sum, v) => sum + v.stressLevel, 0) / session.voiceData.length * 100
    : 0;

  const avgConfidence = session.voiceData.length > 0 
    ? session.voiceData.reduce((sum, v) => sum + v.confidence, 0) / session.voiceData.length * 100
    : 0;

  const negativeVoice = session.voiceData.filter(v => v.sentiment === 'negative').length;
  const positiveVoice = session.voiceData.filter(v => v.sentiment === 'positive').length;

  const sentimentBalance = session.voiceData.length > 0 
    ? ((positiveVoice - negativeVoice) / session.voiceData.length) * 100
    : 0;

  const totalWords = session.voiceData.reduce((sum, v) => sum + v.transcription.split(' ').length, 0);
  const avgWordsPerInteraction = session.voiceData.length > 0 ? Math.round(totalWords / session.voiceData.length) : 0;

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
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className="bg-warning-100 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{Math.round(avgStress)}%</p>
              <p className="text-sm text-gray-600">Avg Stress Level</p>
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
            <div className="bg-therapeutic-100 p-3 rounded-lg">
              <Volume2 className="h-6 w-6 text-therapeutic-600" />
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
            sentimentBalance > 0 ? 'border-therapeutic-200' : 'border-danger-200'
          }`}
        >
          <div className="flex items-center">
            <div className={`${
              sentimentBalance > 0 ? 'bg-therapeutic-100' : 'bg-danger-100'
            } p-3 rounded-lg`}>
              {sentimentBalance > 0 ? (
                <TrendingUp className="h-6 w-6 text-therapeutic-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-danger-600" />
              )}
            </div>
            <div className="ml-4">
              <p className={`text-2xl font-bold ${
                sentimentBalance > 0 ? 'text-therapeutic-600' : 'text-danger-600'
              }`}>
                {sentimentBalance > 0 ? '+' : ''}{Math.round(sentimentBalance)}%
              </p>
              <p className="text-sm text-gray-600">Sentiment Balance</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
          {sentimentData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ sentiment, percentage }) => `${sentiment} (${percentage}%)`}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={sentimentColors[entry.sentiment as keyof typeof sentimentColors] || '#6B7280'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No voice data available
            </div>
          )}
        </motion.div>

        {/* Confidence Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidence Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceData}>
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

      {/* Stress Level Timeline */}
      {stressTimelineData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stress Level Timeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stressTimelineData}>
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
                  dataKey="stress"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
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
              <div className="w-4 h-0.5 bg-danger-500"></div>
              <span className="text-sm text-gray-600">Stress Level</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-therapeutic-500 border-dashed"></div>
              <span className="text-sm text-gray-600">Confidence</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Voice Transcripts Sample */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Interaction Samples</h3>
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {session.voiceData.slice(0, 5).map((voice, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">
                  Interaction {index + 1} - {new Date(voice.timestamp).toLocaleTimeString()}
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    voice.sentiment === 'positive' ? 'bg-therapeutic-100 text-therapeutic-700' :
                    voice.sentiment === 'negative' ? 'bg-danger-100 text-danger-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {voice.sentiment}
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round(voice.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
              <p className="text-gray-900 text-sm leading-relaxed">
                {voice.transcription}
              </p>
              {voice.stressLevel > 0.5 && (
                <div className="mt-2">
                  <span className="text-xs text-warning-600 bg-warning-100 px-2 py-1 rounded-full">
                    High stress detected ({Math.round(voice.stressLevel * 100)}%)
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Detailed Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Voice Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Sentiment Breakdown</h4>
            <div className="space-y-3">
              {sentimentData.map(sentiment => (
                <div key={sentiment.sentiment} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: sentimentColors[sentiment.sentiment as keyof typeof sentimentColors] }}
                    />
                    <span className="capitalize font-medium">{sentiment.sentiment}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${sentiment.percentage}%`,
                          backgroundColor: sentimentColors[sentiment.sentiment as keyof typeof sentimentColors]
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12">{sentiment.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Key Insights</h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Dominant Sentiment</p>
                <p className="text-sm text-gray-600 capitalize">
                  {sentimentData.length > 0 ? sentimentData.reduce((a, b) => a.count > b.count ? a : b).sentiment : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Average Words per Interaction</p>
                <p className="text-sm text-gray-600">
                  {avgWordsPerInteraction} words
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">High Stress Episodes</p>
                <p className="text-sm text-gray-600">
                  {session.voiceData.filter(v => v.stressLevel > 0.7).length} interactions with high stress
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Total Words Spoken</p>
                <p className="text-sm text-gray-600">
                  {totalWords} words across all interactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceAnalysis;
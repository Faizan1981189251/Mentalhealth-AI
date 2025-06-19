import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Session, EmotionData, VoiceData } from '../../types';
import { Calendar, Clock, AlertTriangle, Smile, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface SessionHistoryProps {
  sessions: Session[];
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ sessions }) => {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'risk'>('date');

  const sortedSessions = [...sessions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    }
    return b.riskScore - a.riskScore;
  });

  const getRiskColor = (riskScore: number) => {
    if (riskScore < 30) return 'text-therapeutic-600 bg-therapeutic-100';
    if (riskScore < 70) return 'text-warning-600 bg-warning-100';
    return 'text-danger-600 bg-danger-100';
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    if (!endTime) return 'Ongoing';
    const duration = endTime.getTime() - startTime.getTime();
    const minutes = Math.floor(duration / 60000);
    return `${minutes} min`;
  };

  const getDominantEmotion = (emotionData: EmotionData[]) => {
    if (emotionData.length === 0) return 'N/A';
    
    const emotionCounts = emotionData.reduce((acc, emotion) => {
      acc[emotion.emotion] = (acc[emotion.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(emotionCounts).reduce((a, b) => 
      emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b
    )[0];
  };

  const getAverageSentiment = (voiceData: VoiceData[]) => {
    if (voiceData.length === 0) return 'N/A';
    
    const sentimentCounts = voiceData.reduce((acc, voice) => {
      acc[voice.sentiment] = (acc[voice.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sentimentCounts).reduce((a, b) => 
      sentimentCounts[a[0]] > sentimentCounts[b[0]] ? a : b
    )[0];
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No session history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with sorting */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Session History</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'risk')}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="date">Date</option>
              <option value="risk">Risk Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sortedSessions.map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedSession(
                expandedSession === session.id ? null : session.id
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Session on {new Date(session.startTime).toLocaleDateString()}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(session.startTime).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span>{formatDuration(session.startTime, session.endTime)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(session.riskScore)}`}>
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {Math.round(session.riskScore)}% Risk
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {session.emotionData.length} emotions • {session.voiceData.length} voice samples
                    </p>
                  </div>
                  
                  {expandedSession === session.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedSession === session.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 bg-gray-50"
                >
                  <div className="p-6 space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Smile className="h-5 w-5 text-primary-600" />
                          <div>
                            <p className="text-sm text-gray-600">Dominant Emotion</p>
                            <p className="font-semibold capitalize">
                              {getDominantEmotion(session.emotionData)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="h-5 w-5 text-therapeutic-600" />
                          <div>
                            <p className="text-sm text-gray-600">Voice Sentiment</p>
                            <p className="font-semibold capitalize">
                              {getAverageSentiment(session.voiceData)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-warning-600" />
                          <div>
                            <p className="text-sm text-gray-600">Risk Score</p>
                            <p className="font-semibold">
                              {Math.round(session.riskScore)}%
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Duration</p>
                            <p className="font-semibold">
                              {formatDuration(session.startTime, session.endTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Emotion Timeline */}
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Emotion Timeline</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {session.emotionData.slice(0, 10).map((emotion, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                                <span className="capitalize">{emotion.emotion}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <span>{Math.round(emotion.confidence * 100)}%</span>
                                <span>{new Date(emotion.timestamp).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          ))}
                          {session.emotionData.length > 10 && (
                            <p className="text-xs text-gray-500 text-center pt-2">
                              ... and {session.emotionData.length - 10} more
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Voice Interactions */}
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Voice Interactions</h4>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {session.voiceData.slice(0, 5).map((voice, index) => (
                            <div key={index} className="border-l-2 border-gray-200 pl-3">
                              <p className="text-sm text-gray-900 line-clamp-2">
                                {voice.transcription}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  voice.sentiment === 'positive' ? 'bg-therapeutic-100 text-therapeutic-700' :
                                  voice.sentiment === 'negative' ? 'bg-danger-100 text-danger-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {voice.sentiment}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(voice.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          ))}
                          {session.voiceData.length > 5 && (
                            <p className="text-xs text-gray-500 text-center pt-2">
                              ... and {session.voiceData.length - 5} more interactions
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Session Notes */}
                    {session.notes && (
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Session Notes</h4>
                        <p className="text-sm text-gray-700">{session.notes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SessionHistory;
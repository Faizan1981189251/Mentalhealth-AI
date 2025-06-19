import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Session, VoiceData } from '../../types';
import { MessageCircle, Search, Filter, Download, Calendar, Clock, User } from 'lucide-react';

interface SessionTranscriptsProps {
  sessions: Session[];
}

const SessionTranscripts: React.FC<SessionTranscriptsProps> = ({ sessions }) => {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  const filteredSessions = sessions.filter(session => {
    const hasTranscripts = session.voiceData.length > 0;
    const matchesSearch = searchTerm === '' || 
      session.voiceData.some(voice => 
        voice.transcription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    return hasTranscripts && matchesSearch;
  });

  const getFilteredTranscripts = (voiceData: VoiceData[]) => {
    if (sentimentFilter === 'all') return voiceData;
    return voiceData.filter(voice => voice.sentiment === sentimentFilter);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-therapeutic-600 bg-therapeutic-100';
      case 'negative': return 'text-danger-600 bg-danger-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const exportTranscript = (session: Session) => {
    const transcript = session.voiceData
      .map(voice => `[${new Date(voice.timestamp).toLocaleTimeString()}] ${voice.transcription}`)
      .join('\n');
    
    const content = `Session Transcript - ${new Date(session.startTime).toLocaleDateString()}\n\n${transcript}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${session.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Session Transcripts</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transcripts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Sessions with Transcripts</h3>
              <p className="text-sm text-gray-600">{filteredSessions.length} sessions</p>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredSessions.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No transcripts found</p>
                </div>
              ) : (
                filteredSessions.map(session => (
                  <motion.div
                    key={session.id}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedSession?.id === session.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Patient {session.patientId.slice(-4)}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(session.startTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                          <MessageCircle className="h-3 w-3" />
                          <span>{session.voiceData.length} interactions</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          session.riskScore > 70 ? 'bg-danger-100 text-danger-700' :
                          session.riskScore > 40 ? 'bg-warning-100 text-warning-700' :
                          'bg-therapeutic-100 text-therapeutic-700'
                        }`}>
                          {Math.round(session.riskScore)}% risk
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Transcript Viewer */}
        <div className="lg:col-span-2">
          {selectedSession ? (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Session Transcript
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Patient {selectedSession.patientId.slice(-4)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(selectedSession.startTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(selectedSession.startTime).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => exportTranscript(selectedSession)}
                    className="flex items-center px-3 py-2 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {getFilteredTranscripts(selectedSession.voiceData).map((voice, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-l-2 border-gray-200 pl-4 py-2"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">
                          {new Date(voice.timestamp).toLocaleTimeString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(voice.sentiment)}`}>
                            {voice.sentiment}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.round(voice.confidence * 100)}% confidence
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-900 leading-relaxed">
                        {voice.transcription}
                      </p>
                      {voice.stressLevel > 0.5 && (
                        <div className="mt-2">
                          <span className="text-xs text-warning-600 bg-warning-100 px-2 py-1 rounded-full">
                            High stress detected ({Math.round(voice.stressLevel * 100)}%)
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {getFilteredTranscripts(selectedSession.voiceData).length === 0 && (
                  <div className="text-center py-8">
                    <Filter className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No transcripts match the current filter</p>
                  </div>
                )}
              </div>

              {/* Session Summary */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-3">Session Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {selectedSession.voiceData.length}
                    </p>
                    <p className="text-sm text-gray-600">Total Interactions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-therapeutic-600">
                      {selectedSession.voiceData.filter(v => v.sentiment === 'positive').length}
                    </p>
                    <p className="text-sm text-gray-600">Positive</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-danger-600">
                      {selectedSession.voiceData.filter(v => v.sentiment === 'negative').length}
                    </p>
                    <p className="text-sm text-gray-600">Negative</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning-600">
                      {Math.round(selectedSession.riskScore)}%
                    </p>
                    <p className="text-sm text-gray-600">Risk Score</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a Session
              </h3>
              <p className="text-gray-600">
                Choose a session from the list to view its transcript and analysis
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionTranscripts;
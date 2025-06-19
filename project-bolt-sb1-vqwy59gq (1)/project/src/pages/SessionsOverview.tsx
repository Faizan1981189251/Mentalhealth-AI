import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Session } from '../types';
import { Calendar, Clock, User, AlertTriangle, TrendingUp, TrendingDown, BarChart3, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SessionsOverview: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'risk' | 'patient'>('date');

  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem('mindbridge_sessions') || '[]');
    setSessions(savedSessions);
  }, []);

  const filteredSessions = selectedPatient 
    ? sessions.filter(s => s.patientId === selectedPatient)
    : sessions;

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      case 'risk':
        return b.riskScore - a.riskScore;
      case 'patient':
        return a.patientId.localeCompare(b.patientId);
      default:
        return 0;
    }
  });

  const patients = Array.from(new Set(sessions.map(s => s.patientId)));
  const highRiskSessions = sessions.filter(s => s.riskScore > 70);
  const avgRiskScore = sessions.length > 0 
    ? sessions.reduce((sum, s) => sum + s.riskScore, 0) / sessions.length 
    : 0;

  // Prepare trend data
  const trendData = sessions
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(-10)
    .map((session, index) => ({
      session: `S${index + 1}`,
      risk: session.riskScore,
      date: new Date(session.startTime).toLocaleDateString()
    }));

  const getRiskColor = (riskScore: number) => {
    if (riskScore > 70) return 'bg-danger-100 text-danger-700 border-danger-200';
    if (riskScore > 40) return 'bg-warning-100 text-warning-700 border-warning-200';
    return 'bg-therapeutic-100 text-therapeutic-700 border-therapeutic-200';
  };

  const getDepressionLevel = (riskScore: number) => {
    if (riskScore > 80) return 'Severe';
    if (riskScore > 60) return 'Moderate';
    if (riskScore > 30) return 'Mild';
    return 'Minimal';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recorded Sessions</h1>
            <p className="text-gray-600 mt-1">Comprehensive analysis of all patient sessions</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPatient || ''}
              onChange={(e) => setSelectedPatient(e.target.value || null)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Patients</option>
              {patients.map(patientId => (
                <option key={patientId} value={patientId}>
                  Patient {patientId.slice(-4)}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="risk">Sort by Risk</option>
              <option value="patient">Sort by Patient</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
              <p className="text-sm text-gray-600">Total Sessions</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="bg-therapeutic-100 p-3 rounded-lg">
              <User className="h-6 w-6 text-therapeutic-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              <p className="text-sm text-gray-600">Active Patients</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="bg-danger-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{highRiskSessions.length}</p>
              <p className="text-sm text-gray-600">High Risk Sessions</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="bg-warning-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{Math.round(avgRiskScore)}%</p>
              <p className="text-sm text-gray-600">Average Risk Score</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Risk Trend Chart */}
      {trendData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Score Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="session" stroke="#6b7280" fontSize={12} />
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
                  dataKey="risk"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Sessions List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Session Records</h3>
          <p className="text-sm text-gray-600">{sortedSessions.length} sessions found</p>
        </div>

        <div className="divide-y divide-gray-200">
          {sortedSessions.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sessions Found</h3>
              <p className="text-gray-600">No recorded sessions match your current filters.</p>
            </div>
          ) : (
            sortedSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Patient {session.patientId.slice(-4)}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(session.startTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(session.startTime).toLocaleTimeString()}</span>
                        </div>
                        <span>•</span>
                        <span>{session.emotionData.length} emotions</span>
                        <span>•</span>
                        <span>{session.voiceData.length} voice samples</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(session.riskScore)}`}>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {Math.round(session.riskScore)}% Risk
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {getDepressionLevel(session.riskScore)} Depression Level
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/session-analysis/${session.id}`)}
                      className="flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Analyze
                    </button>
                  </div>
                </div>

                {/* Quick Insights */}
                <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {session.emotionData.filter(e => ['sad', 'angry', 'fear'].includes(e.emotion)).length}
                    </p>
                    <p className="text-xs text-gray-600">Negative Emotions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {session.voiceData.filter(v => v.sentiment === 'negative').length}
                    </p>
                    <p className="text-xs text-gray-600">Negative Voice</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {session.endTime 
                        ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000)
                        : 'N/A'
                      }
                    </p>
                    <p className="text-xs text-gray-600">Duration (min)</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionsOverview;
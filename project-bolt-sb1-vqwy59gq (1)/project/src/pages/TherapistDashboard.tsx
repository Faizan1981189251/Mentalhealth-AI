import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PatientAnalytics from '../components/Therapist/PatientAnalytics';
import RiskAssessment from '../components/Therapist/RiskAssessment';
import SessionHistory from '../components/Therapist/SessionHistory';
import SessionTranscripts from '../components/Therapist/SessionTranscripts';
import PatientList from '../components/Therapist/PatientList';
import { Session } from '../types';
import { Users, BarChart3, AlertTriangle, Clock, MessageCircle } from 'lucide-react';

const TherapistDashboard: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'sessions' | 'risks' | 'transcripts'>('overview');

  useEffect(() => {
    // Load sessions from localStorage (in production, this would be from Firebase)
    const savedSessions = JSON.parse(localStorage.getItem('mindbridge_sessions') || '[]');
    setSessions(savedSessions);
  }, []);

  const filteredSessions = selectedPatient 
    ? sessions.filter(s => s.patientId === selectedPatient)
    : sessions;

  const highRiskSessions = sessions.filter(s => s.riskScore > 70);
  const criticalRiskSessions = sessions.filter(s => s.riskScore > 85);
  const totalPatients = new Set(sessions.map(s => s.patientId)).size;
  const avgRiskScore = sessions.length > 0 
    ? sessions.reduce((sum, s) => sum + s.riskScore, 0) / sessions.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Therapist Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor patient progress and mental health indicators</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">{totalPatients}</p>
              <p className="text-sm text-gray-600">Active Patients</p>
            </div>
            {criticalRiskSessions.length > 0 && (
              <div className="bg-danger-100 text-danger-700 px-4 py-2 rounded-lg">
                <p className="text-sm font-medium">
                  {criticalRiskSessions.length} Critical Alert{criticalRiskSessions.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{totalPatients}</p>
              <p className="text-sm text-gray-600">Total Patients</p>
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
            <div className="bg-therapeutic-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-therapeutic-600" />
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
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="bg-warning-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{highRiskSessions.length}</p>
              <p className="text-sm text-gray-600">High Risk Alerts</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="bg-danger-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{Math.round(avgRiskScore)}%</p>
              <p className="text-sm text-gray-600">Avg Risk Score</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'sessions', label: 'Sessions', icon: Clock },
            { id: 'transcripts', label: 'Transcripts', icon: MessageCircle },
            { id: 'risks', label: 'Risk Assessment', icon: AlertTriangle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <PatientList 
            sessions={sessions} 
            selectedPatient={selectedPatient}
            onSelectPatient={setSelectedPatient}
          />
        </div>

        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <PatientAnalytics sessions={filteredSessions} />
                <RiskAssessment sessions={filteredSessions} />
              </div>
            )}

            {activeTab === 'analytics' && (
              <PatientAnalytics sessions={filteredSessions} />
            )}

            {activeTab === 'sessions' && (
              <SessionHistory sessions={filteredSessions} />
            )}

            {activeTab === 'transcripts' && (
              <SessionTranscripts sessions={filteredSessions} />
            )}

            {activeTab === 'risks' && (
              <RiskAssessment sessions={filteredSessions} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;
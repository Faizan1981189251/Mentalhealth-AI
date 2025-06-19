import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Session } from '../types';
import SessionOverview from '../components/Analysis/SessionOverview';
import EmotionAnalysis from '../components/Analysis/EmotionAnalysis';
import VoiceAnalysis from '../components/Analysis/VoiceAnalysis';
import DepressionAssessment from '../components/Analysis/DepressionAssessment';
import Recommendations from '../components/Analysis/Recommendations';
import { ArrowLeft, Calendar, Clock, User, AlertTriangle } from 'lucide-react';

const SessionAnalysis: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'emotions' | 'voice' | 'depression' | 'recommendations'>('overview');

  useEffect(() => {
    // Load session data
    const sessions = JSON.parse(localStorage.getItem('mindbridge_sessions') || '[]');
    const foundSession = sessions.find((s: Session) => s.id === sessionId);
    setSession(foundSession || null);
  }, [sessionId]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Session Not Found</h2>
          <p className="text-gray-600 mb-4">The requested session could not be found.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'emotions', label: 'Emotion Analysis', icon: User },
    { id: 'voice', label: 'Voice Analysis', icon: Clock },
    { id: 'depression', label: 'Depression Assessment', icon: AlertTriangle },
    { id: 'recommendations', label: 'Recommendations', icon: ArrowLeft }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Session Analysis
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Patient {session.patientId.slice(-4)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(session.startTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(session.startTime).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-lg font-medium ${
              session.riskScore > 70 ? 'bg-danger-100 text-danger-700' :
              session.riskScore > 40 ? 'bg-warning-100 text-warning-700' :
              'bg-therapeutic-100 text-therapeutic-700'
            }`}>
              Risk Score: {Math.round(session.riskScore)}%
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map(tab => (
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

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <SessionOverview session={session} />}
          {activeTab === 'emotions' && <EmotionAnalysis session={session} />}
          {activeTab === 'voice' && <VoiceAnalysis session={session} />}
          {activeTab === 'depression' && <DepressionAssessment session={session} />}
          {activeTab === 'recommendations' && <Recommendations session={session} />}
        </motion.div>
      </div>
    </div>
  );
};

export default SessionAnalysis;
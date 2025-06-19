import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EmotionDetection from '../components/Patient/EmotionDetection';
import VoiceChatbot from '../components/Patient/VoiceChatbot';
import SessionControls from '../components/Patient/SessionControls';
import RiskIndicator from '../components/Patient/RiskIndicator';
import { useSession } from '../contexts/SessionContext';
import { Activity, Brain, MessageCircle, Video } from 'lucide-react';

const PatientDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'split' | 'emotion' | 'chat'>('split');
  const { isRecording, riskFactors } = useSession();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Mental Health Session</h1>
            <p className="text-gray-600 mt-1">
              {isRecording ? 'Session in progress' : 'Ready to start your wellness session'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <RiskIndicator riskScore={riskFactors.overallRisk} />
            <SessionControls />
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveView('split')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'split'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Activity className="h-4 w-4 mr-2" />
            Split View
          </button>
          <button
            onClick={() => setActiveView('emotion')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'emotion'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Video className="h-4 w-4 mr-2" />
            Emotion Detection
          </button>
          <button
            onClick={() => setActiveView('chat')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'chat'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            AI Chatbot
          </button>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {activeView === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Emotion Detection
                </h2>
              </div>
              <div className="p-6">
                <EmotionDetection />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-therapeutic-500 to-therapeutic-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Therapeutic Assistant
                </h2>
              </div>
              <div className="p-6">
                <VoiceChatbot />
              </div>
            </div>
          </div>
        )}

        {activeView === 'emotion' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Video className="h-6 w-6 mr-2 text-primary-600" />
              Real-time Emotion Detection
            </h2>
            <EmotionDetection />
          </div>
        )}

        {activeView === 'chat' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Brain className="h-6 w-6 mr-2 text-therapeutic-600" />
              AI Therapeutic Assistant
            </h2>
            <VoiceChatbot />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PatientDashboard;
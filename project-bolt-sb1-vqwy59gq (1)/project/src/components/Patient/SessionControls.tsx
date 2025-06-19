import React from 'react';
import { motion } from 'framer-motion';
import { useSession } from '../../contexts/SessionContext';
import { Play, Square, Clock } from 'lucide-react';

const SessionControls: React.FC = () => {
  const { currentSession, isRecording, startSession, endSession } = useSession();

  const formatDuration = (startTime: Date) => {
    const now = new Date();
    const diff = now.getTime() - startTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-4">
      {currentSession && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-2 bg-primary-50 px-3 py-2 rounded-lg"
        >
          <Clock className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-medium text-primary-700">
            {formatDuration(currentSession.startTime)}
          </span>
        </motion.div>
      )}

      {!isRecording ? (
        <button
          onClick={startSession}
          className="flex items-center px-6 py-3 bg-therapeutic-600 text-white rounded-lg font-medium hover:bg-therapeutic-700 transition-colors shadow-sm"
        >
          <Play className="h-5 w-5 mr-2" />
          Start Session
        </button>
      ) : (
        <button
          onClick={endSession}
          className="flex items-center px-6 py-3 bg-danger-600 text-white rounded-lg font-medium hover:bg-danger-700 transition-colors shadow-sm"
        >
          <Square className="h-5 w-5 mr-2" />
          End Session
        </button>
      )}
    </div>
  );
};

export default SessionControls;
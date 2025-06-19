import React, { createContext, useContext, useEffect, useState } from 'react';
import { EmotionData, VoiceData, Session, DepressionRiskFactors } from '../types';
import { useAuth } from './AuthContext';

interface SessionContextType {
  currentSession: Session | null;
  isRecording: boolean;
  emotionData: EmotionData[];
  voiceData: VoiceData[];
  riskFactors: DepressionRiskFactors;
  startSession: () => void;
  endSession: () => void;
  addEmotionData: (data: EmotionData) => void;
  addVoiceData: (data: VoiceData) => void;
  calculateRiskScore: () => number;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [emotionData, setEmotionData] = useState<EmotionData[]>([]);
  const [voiceData, setVoiceData] = useState<VoiceData[]>([]);
  const [riskFactors, setRiskFactors] = useState<DepressionRiskFactors>({
    emotionalStability: 0,
    voiceSentiment: 0,
    behavioralPatterns: 0,
    overallRisk: 0
  });

  const startSession = () => {
    if (!user) return;

    const newSession: Session = {
      id: Date.now().toString(),
      patientId: user.id,
      startTime: new Date(),
      emotionData: [],
      voiceData: [],
      riskScore: 0
    };

    setCurrentSession(newSession);
    setIsRecording(true);
    setEmotionData([]);
    setVoiceData([]);
  };

  const endSession = () => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        endTime: new Date(),
        emotionData,
        voiceData,
        riskScore: calculateRiskScore()
      };

      // Save session to localStorage (in production, this would be Firebase)
      const sessions = JSON.parse(localStorage.getItem('mindbridge_sessions') || '[]');
      sessions.push(updatedSession);
      localStorage.setItem('mindbridge_sessions', JSON.stringify(sessions));
    }

    setCurrentSession(null);
    setIsRecording(false);
  };

  const addEmotionData = (data: EmotionData) => {
    setEmotionData(prev => [...prev, data]);
  };

  const addVoiceData = (data: VoiceData) => {
    setVoiceData(prev => [...prev, data]);
  };

  const calculateRiskScore = (): number => {
    if (emotionData.length === 0 && voiceData.length === 0) return 0;

    // Calculate emotional stability based on recent emotions
    const recentEmotions = emotionData.slice(-10);
    const negativeEmotions = recentEmotions.filter(
      e => ['sad', 'angry', 'fear', 'disgust'].includes(e.emotion)
    );
    const emotionalStability = Math.max(0, 100 - (negativeEmotions.length / recentEmotions.length) * 100);

    // Calculate voice sentiment
    const recentVoice = voiceData.slice(-5);
    const negativeVoice = recentVoice.filter(v => v.sentiment === 'negative');
    const voiceSentiment = Math.max(0, 100 - (negativeVoice.length / recentVoice.length) * 100);

    // Behavioral patterns (simplified)
    const behavioralPatterns = 75; // Would be calculated from usage patterns

    const overallRisk = 100 - ((emotionalStability + voiceSentiment + behavioralPatterns) / 3);

    const newRiskFactors = {
      emotionalStability,
      voiceSentiment,
      behavioralPatterns,
      overallRisk
    };

    setRiskFactors(newRiskFactors);
    return overallRisk;
  };

  const value = {
    currentSession,
    isRecording,
    emotionData,
    voiceData,
    riskFactors,
    startSession,
    endSession,
    addEmotionData,
    addVoiceData,
    calculateRiskScore
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};
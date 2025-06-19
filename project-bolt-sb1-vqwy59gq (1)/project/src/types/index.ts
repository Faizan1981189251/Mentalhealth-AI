export interface User {
  id: string;
  email: string;
  role: 'patient' | 'therapist';
  firstName: string;
  lastName: string;
  createdAt: Date;
  lastLogin?: Date;
  isApproved?: boolean;
  licenseNumber?: string;
  specializations?: string[];
}

export interface Patient extends User {
  role: 'patient';
  therapistId?: string;
  currentMood?: number;
  riskLevel: 'low' | 'moderate' | 'high';
}

export interface Therapist extends User {
  role: 'therapist';
  licenseNumber: string;
  specializations: string[];
  patients: string[];
  isApproved: boolean;
}

export interface EmotionData {
  timestamp: Date;
  emotion: 'happy' | 'sad' | 'angry' | 'surprised' | 'fear' | 'disgust' | 'neutral';
  confidence: number;
  intensity: number;
}

export interface VoiceData {
  timestamp: Date;
  transcription: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  stressLevel: number;
}

export interface Session {
  id: string;
  patientId: string;
  therapistId?: string;
  startTime: Date;
  endTime?: Date;
  emotionData: EmotionData[];
  voiceData: VoiceData[];
  riskScore: number;
  notes?: string;
}

export interface DepressionRiskFactors {
  emotionalStability: number;
  voiceSentiment: number;
  behavioralPatterns: number;
  overallRisk: number;
}
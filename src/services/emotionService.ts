import { v4 as uuidv4 } from 'uuid';

// Mock function to simulate emotion detection API
export const mockEmotionDetection = () => {
  // Generate random emotion scores that sum to 1
  const emotions = [
    { name: 'Happiness', score: Math.random(), color: '#4CAF50' },
    { name: 'Sadness', score: Math.random(), color: '#2196F3' },
    { name: 'Anger', score: Math.random(), color: '#F44336' },
    { name: 'Fear', score: Math.random(), color: '#9C27B0' },
    { name: 'Surprise', score: Math.random(), color: '#FF9800' },
    { name: 'Disgust', score: Math.random(), color: '#795548' },
    { name: 'Neutral', score: Math.random(), color: '#9E9E9E' }
  ];
  
  // Normalize scores to sum to 1
  const sum = emotions.reduce((acc, emotion) => acc + emotion.score, 0);
  emotions.forEach(emotion => {
    emotion.score = emotion.score / sum;
  });
  
  // Sort by score descending
  emotions.sort((a, b) => b.score - a.score);
  
  // Get dominant emotion
  const dominantEmotion = emotions[0].name;
  
  // Generate depression risk level
  const riskScores = {
    low: { min: 0, max: 0.3 },
    moderate: { min: 0.3, max: 0.7 },
    high: { min: 0.7, max: 1 }
  };
  
  // Calculate risk based on sadness and neutral scores
  const sadnessScore = emotions.find(e => e.name === 'Sadness')?.score || 0;
  const neutralScore = emotions.find(e => e.name === 'Neutral')?.score || 0;
  const fearScore = emotions.find(e => e.name === 'Fear')?.score || 0;
  
  // Calculate depression risk score as a weighted combination
  const depressionRiskRaw = (sadnessScore * 0.5) + (neutralScore * 0.3) + (fearScore * 0.2);
  
  // Map to low/moderate/high
  let riskLevel: 'low' | 'moderate' | 'high' = 'low';
  if (depressionRiskRaw >= riskScores.high.min) {
    riskLevel = 'high';
  } else if (depressionRiskRaw >= riskScores.moderate.min) {
    riskLevel = 'moderate';
  }
  
  // Generate risk factors based on the level
  const factors = [
    'Elevated sadness markers in facial expressions',
    'Reduced variation in emotional expressions',
    'Minimal positive emotion indicators',
    'Increased signs of emotional fatigue'
  ];
  
  // Select a subset of factors based on risk level
  const selectedFactors = factors.slice(0, riskLevel === 'low' ? 1 : riskLevel === 'moderate' ? 2 : 4);
  
  // Generate recommendations
  const recommendationsPool = [
    'Schedule regular check-ins with friends or family',
    'Consider speaking with a mental health professional',
    'Practice mindfulness meditation for 10 minutes daily',
    'Establish a consistent sleep schedule',
    'Engage in physical activity for 30 minutes each day',
    'Keep a mood journal to track emotional patterns',
    'Limit social media consumption',
    'Set aside time for activities you enjoy'
  ];
  
  // Select 3-5 recommendations
  const numRecommendations = 3 + Math.floor(Math.random() * 3);
  const shuffledRecommendations = [...recommendationsPool].sort(() => 0.5 - Math.random());
  const selectedRecommendations = shuffledRecommendations.slice(0, numRecommendations);
  
  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    dominantEmotion,
    emotions,
    depressionRisk: {
      level: riskLevel,
      score: depressionRiskRaw,
      factors: selectedFactors
    },
    recommendations: selectedRecommendations
  };
};
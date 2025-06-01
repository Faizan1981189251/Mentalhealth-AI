import { format, subDays } from 'date-fns';

// Mock user data for dashboard
export const mockUserData = () => {
  return {
    currentMood: {
      label: ['Hopeful', 'Content', 'Optimistic', 'Calm'][Math.floor(Math.random() * 4)],
      change: Math.floor(Math.random() * 40) - 20, // -20 to +20
      source: ['emotion analysis', 'chat conversation', 'self-report'][Math.floor(Math.random() * 3)]
    },
    streak: Math.floor(Math.random() * 30) + 1,
    emotionalVariety: {
      score: ['Limited', 'Moderate', 'Diverse'][Math.floor(Math.random() * 3)],
      change: Math.floor(Math.random() * 30) - 10, // -10 to +20
      description: 'Range of emotions expressed'
    },
    lastCheckIn: new Date(Date.now() - Math.floor(Math.random() * 5) * 86400000), // 0-5 days ago
    daysSinceCheckIn: Math.floor(Math.random() * 5),
    insights: [
      {
        title: 'Mood Improvement',
        description: 'Your overall mood has improved by 15% compared to last week.',
        date: subDays(new Date(), 1),
        type: 'positive'
      },
      {
        title: 'Sleep Pattern',
        description: 'Your reported sleep quality correlates with more positive emotions.',
        date: subDays(new Date(), 3),
        type: 'neutral'
      },
      {
        title: 'Stress Trigger Identified',
        description: 'Work-related discussions consistently trigger stress indicators.',
        date: subDays(new Date(), 5),
        type: 'negative'
      },
      {
        title: 'Conversation Impact',
        description: 'Talking with the AI companion appears to reduce anxiety markers.',
        date: subDays(new Date(), 7),
        type: 'positive'
      }
    ]
  };
};

// Mock weekly mood data
export const mockWeeklyMoodData = (timeRange: 'week' | 'month' | 'year') => {
  const today = new Date();
  let numberOfDays: number;
  
  switch (timeRange) {
    case 'week':
      numberOfDays = 7;
      break;
    case 'month':
      numberOfDays = 30;
      break;
    case 'year':
      numberOfDays = 12; // Will show months instead of days
      break;
    default:
      numberOfDays = 7;
  }
  
  const data = [];
  const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
  
  for (let i = numberOfDays - 1; i >= 0; i--) {
    const date = subDays(today, i);
    let dateLabel: string;
    
    if (timeRange === 'year') {
      // For year view, use month names
      dateLabel = format(new Date(today.getFullYear(), today.getMonth() - i, 1), 'MMM');
    } else {
      // For week and month view, use day format
      dateLabel = format(date, numberOfDays > 10 ? 'MMM d' : 'EEE');
    }
    
    // Generate a value between 1 and 5 with some consistency (not too random)
    let baseValue = 3; // Start at neutral
    // Add some randomness but with a trend
    const randomFactor = Math.sin(i * 0.5) * 1.5;
    let value = Math.max(1, Math.min(5, Math.round(baseValue + randomFactor)));
    
    data.push({
      date: dateLabel,
      value,
      label: moodLabels[value - 1]
    });
  }
  
  return data;
};

// Mock emotion breakdown data
export const mockEmotionBreakdown = () => {
  // Create initial random values
  const emotions = [
    { name: 'Happiness', value: Math.random(), color: '#4CAF50' },
    { name: 'Sadness', value: Math.random() * 0.5, color: '#2196F3' },
    { name: 'Anger', value: Math.random() * 0.3, color: '#F44336' },
    { name: 'Fear', value: Math.random() * 0.3, color: '#9C27B0' },
    { name: 'Surprise', value: Math.random() * 0.2, color: '#FF9800' },
    { name: 'Disgust', value: Math.random() * 0.1, color: '#795548' }
  ];
  
  // Normalize values to sum to 1
  const sum = emotions.reduce((acc, emotion) => acc + emotion.value, 0);
  emotions.forEach(emotion => {
    emotion.value = emotion.value / sum;
  });
  
  return emotions;
};
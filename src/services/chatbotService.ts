// Mock service for the AI chatbot

const positiveResponses = [
  "I'm glad to hear you're feeling well! What's been contributing to your positive mood?",
  "That's great to hear! What activities have you been enjoying lately?",
  "I'm happy that you're doing well. What are you looking forward to?",
  "Wonderful! Maintaining positive emotions is important. How do you plan to continue this positive momentum?",
  "That's excellent! Is there anything specific that's been helping you feel good?"
];

const negativeResponses = [
  "I'm sorry to hear you're not feeling well. Would you like to talk more about what's troubling you?",
  "That sounds challenging. Remember that it's okay to have difficult emotions. What might help you feel a bit better right now?",
  "I understand this is difficult. Have you been experiencing these feelings for a while?",
  "Thank you for sharing that with me. Would it help to discuss some coping strategies?",
  "I appreciate you opening up about your feelings. Is there anything specific that triggered these emotions?"
];

const neutralResponses = [
  "How have you been feeling overall lately?",
  "Would you like to explore some ways to enhance your well-being?",
  "What aspects of your mental health are you most interested in focusing on?",
  "Is there anything specific you'd like support with today?",
  "What are your goals for improving your emotional well-being?"
];

const therapeuticQuestions = [
  "How have your sleep patterns been recently?",
  "Have you noticed any changes in your energy levels or appetite?",
  "What activities bring you joy or a sense of accomplishment?",
  "How would you describe your support system?",
  "What coping strategies have worked for you in the past?",
  "How do you typically handle stress?",
  "Are there any recurring thoughts or worries you've been experiencing?",
  "What would an ideal day look like for you?",
  "How do you practice self-care?",
  "What are your strengths that help you through difficult times?"
];

// Function to detect sentiment in a message
const detectSentiment = (message: string): 'positive' | 'negative' | 'neutral' => {
  const positiveWords = ['good', 'great', 'happy', 'excellent', 'wonderful', 'joy', 'pleased', 'excited', 'better', 'amazing'];
  const negativeWords = ['bad', 'sad', 'upset', 'depressed', 'anxious', 'worried', 'stressed', 'terrible', 'unhappy', 'miserable', 'tired', 'exhausted'];
  
  const lowerMessage = message.toLowerCase();
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (lowerMessage.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (lowerMessage.includes(word)) negativeScore++;
  });
  
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
};

export const mockChatbotResponse = (userMessage: string): string => {
  // Detect sentiment
  const sentiment = detectSentiment(userMessage);
  
  // Select response pool based on sentiment
  let responsePool: string[];
  switch (sentiment) {
    case 'positive':
      responsePool = positiveResponses;
      break;
    case 'negative':
      responsePool = negativeResponses;
      break;
    default:
      responsePool = neutralResponses;
  }
  
  // 30% chance to add a therapeutic question
  const addTherapeuticQuestion = Math.random() < 0.3;
  
  // Get random response
  const response = responsePool[Math.floor(Math.random() * responsePool.length)];
  
  if (addTherapeuticQuestion) {
    const question = therapeuticQuestions[Math.floor(Math.random() * therapeuticQuestions.length)];
    return `${response}\n\n${question}`;
  }
  
  return response;
};
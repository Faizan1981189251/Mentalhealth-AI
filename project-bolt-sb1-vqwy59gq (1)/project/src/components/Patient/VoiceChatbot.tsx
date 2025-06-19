import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../../contexts/SessionContext';
import { VoiceData } from '../../types';
import { Mic, MicOff, Send, Volume2, VolumeX, Bot, User, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

const VoiceChatbot: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI therapeutic assistant. I'm here to listen and provide support. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [speechError, setSpeechError] = useState<string>('');
  
  const { addVoiceData, isRecording } = useSession();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            handleUserMessage(finalTranscript);
            setCurrentTranscript('');
            setSpeechError(''); // Clear any previous errors on successful recognition
          } else {
            setCurrentTranscript(interimTranscript);
          }
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          // Set user-friendly error messages
          switch (event.error) {
            case 'no-speech':
              setSpeechError('No speech detected. Please check your microphone and try speaking closer to it.');
              break;
            case 'audio-capture':
              setSpeechError('Microphone access denied or not available. Please check your browser permissions.');
              break;
            case 'not-allowed':
              setSpeechError('Microphone permission denied. Please allow microphone access and try again.');
              break;
            case 'network':
              setSpeechError('Network error occurred. Please check your internet connection.');
              break;
            case 'aborted':
              setSpeechError('Speech recognition was stopped.');
              break;
            default:
              setSpeechError(`Speech recognition error: ${event.error}. Please try again.`);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setSpeechError(''); // Clear any previous errors
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleUserMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Add voice data for analysis
    if (isRecording) {
      const voiceData: VoiceData = {
        timestamp: new Date(),
        transcription: content,
        sentiment: analyzeSentiment(content),
        confidence: 0.85,
        stressLevel: calculateStressLevel(content)
      };
      addVoiceData(voiceData);
    }

    // Simulate bot response
    setTimeout(() => {
      const response = generateBotResponse(content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      if (audioEnabled) {
        speakText(response);
      }
    }, 1000 + Math.random() * 2000);
  };

  const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['happy', 'good', 'great', 'better', 'well', 'fine', 'excellent', 'wonderful'];
    const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'depressed', 'anxious', 'worried', 'stressed'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const calculateStressLevel = (text: string): number => {
    const stressIndicators = ['stressed', 'anxious', 'worried', 'overwhelmed', 'pressure', 'difficult'];
    const lowerText = text.toLowerCase();
    const stressCount = stressIndicators.filter(word => lowerText.includes(word)).length;
    return Math.min(stressCount * 0.3, 1);
  };

  const generateBotResponse = (userInput: string): string => {
    const responses = {
      greeting: [
        "Thank you for sharing that with me. I'm here to listen and support you.",
        "I appreciate you opening up. How can I help you feel more at ease today?",
        "I'm glad you're taking time for yourself. What's been on your mind lately?"
      ],
      positive: [
        "It's wonderful to hear that you're feeling positive! What's been contributing to these good feelings?",
        "That's great to hear! Maintaining this positive mindset can be really beneficial for your wellbeing.",
        "I'm so glad you're experiencing these positive emotions. How can we build on this?"
      ],
      negative: [
        "I hear that you're going through a difficult time. Remember that it's okay to feel this way, and you're not alone.",
        "Thank you for trusting me with these feelings. What do you think might help you feel a little better right now?",
        "These feelings are valid and important. Sometimes talking through them can provide some relief. Can you tell me more?"
      ],
      neutral: [
        "I understand. Sometimes we need time to process our thoughts and feelings. Is there anything specific you'd like to explore?",
        "That's okay. How has your day been treating you so far?",
        "I'm here whenever you're ready to share more. What would feel most helpful to discuss right now?"
      ]
    };

    const sentiment = analyzeSentiment(userInput);
    const responseArray = responses[sentiment] || responses.neutral;
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && audioEnabled) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-96">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-t-lg">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <div className={`p-1 rounded-full ${
                    message.type === 'user' ? 'bg-primary-700' : 'bg-therapeutic-100'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-3 w-3 text-white" />
                    ) : (
                      <Bot className="h-3 w-3 text-therapeutic-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-primary-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Live Transcript */}
        {currentTranscript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end"
          >
            <div className="max-w-xs lg:max-w-md px-4 py-2 bg-primary-200 text-primary-800 rounded-lg">
              <p className="text-sm italic">{currentTranscript}</p>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Controls */}
      <div className="bg-white border-t border-gray-200 p-4 rounded-b-lg">
        {/* Speech Error Display */}
        {speechError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2"
          >
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-800">{speechError}</p>
              <button
                onClick={() => setSpeechError('')}
                className="text-xs text-amber-600 hover:text-amber-800 mt-1 underline"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={audioEnabled ? () => setAudioEnabled(false) : () => setAudioEnabled(true)}
              className={`p-2 rounded-lg transition-colors ${
                audioEnabled
                  ? 'text-therapeutic-600 bg-therapeutic-100 hover:bg-therapeutic-200'
                  : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
            
            {isSpeaking && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex items-center text-sm text-therapeutic-600"
              >
                <div className="w-2 h-2 bg-therapeutic-600 rounded-full mr-2" />
                Speaking...
              </motion.div>
            )}
          </div>

          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!isRecording}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
              isListening
                ? 'bg-danger-600 text-white hover:bg-danger-700'
                : 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Speaking
              </>
            )}
          </button>
        </div>

        {!isRecording && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Start a session to enable voice interaction
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceChatbot;
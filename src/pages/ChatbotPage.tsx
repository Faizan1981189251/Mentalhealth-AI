import React, { useState, useRef, useEffect } from 'react';
import { Send, Info, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { mockChatbotResponse } from '../services/chatbotService';
import Avatar from '../components/ui/Avatar';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! I'm your mental health assistant. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // In a real app, we would call an actual API
    // For demo purposes, we'll use a mock service with a delay
    setTimeout(() => {
      const botResponse = mockChatbotResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const startNewConversation = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: "Hello! I'm your mental health assistant. How are you feeling today?",
        timestamp: new Date()
      }
    ]);
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Supportive AI Chat</h1>
          <Button
            onClick={startNewConversation}
            className="text-gray-600 hover:text-gray-900 flex items-center text-sm"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            New Conversation
          </Button>
        </div>
        <p className="text-gray-600 mt-2">
          Have a conversation with our AI assistant, designed to provide mental health support and guidance.
        </p>
      </div>
      
      <Card className="mb-4 overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              While our AI can provide support, it's not a replacement for professional help. 
              If you're experiencing a mental health emergency, please contact a healthcare provider.
            </p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map(message => (
            <div
              key={message.id}
              className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar
                  name={message.sender === 'user' ? 'You' : 'AI'}
                  className={`${message.sender === 'user' ? 'ml-3' : 'mr-3'} ${
                    message.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}
                />
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <div 
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="flex items-start">
                <Avatar
                  name="AI"
                  className="mr-3 bg-green-100 text-green-600"
                />
                <div className="rounded-lg p-3 bg-white border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-end">
            <textarea
              className="flex-1 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Type your message here..."
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="text-sm text-gray-500 flex items-start">
        <Info className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
        <p>
          Your conversations are private and can be deleted at any time. The AI uses your chat history to provide
          more personalized support but does not share this information with third parties.
        </p>
      </div>
    </div>
  );
};

export default ChatbotPage;
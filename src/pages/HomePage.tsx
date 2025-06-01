import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Heart, Shield, MessageSquare } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered Support for Your Mental Well-being
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            An intelligent companion that helps detect emotional patterns, provides
            supportive conversations, and guides you toward better mental health.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center"
              >
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => navigate('/register')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
                >
                  Get Started
                </Button>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="bg-gray hover:bg-black-100 text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-medium"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200">
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">AI Mental Health Assistant Demo</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How We Can Help</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Brain className="h-10 w-10 text-blue-500" />}
              title="Emotion Recognition"
              description="Our AI analyzes facial expressions to help understand your emotional patterns and detect signs of depression."
            />
            <FeatureCard 
              icon={<MessageSquare className="h-10 w-10 text-green-500" />}
              title="Supportive AI Chat"
              description="Have therapeutic conversations with our empathetic AI assistant trained to provide mental health support."
            />
            <FeatureCard 
              icon={<Heart className="h-10 w-10 text-red-500" />}
              title="Mood Tracking"
              description="Monitor your emotional wellbeing over time with visual dashboards and personalized insights."
            />
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-purple-500" />}
              title="Privacy Focused"
              description="Your data is encrypted and handled with the utmost care, ensuring your information stays private."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Begin Your Journey to Better Mental Health</h2>
          <p className="text-xl text-gray-700 mb-8">
            Take the first step toward understanding and improving your emotional wellbeing with our AI-powered tools.
          </p>
          {!user && (
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center"
            >
              Start Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default HomePage;
import React from 'react';
import { ExternalLink, BookOpen, Phone, Users, Video, Heart } from 'lucide-react';
import Card from '../components/ui/Card';

const ResourcesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mental Health Resources</h1>
        <p className="text-gray-600">
          Access helpful resources, support options, and professional services for your mental wellbeing.
        </p>
      </div>
      
      {/* Emergency Resources */}
      <div className="mb-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-6 mb-6">
          <h2 className="text-xl font-bold text-red-800 mb-2 flex items-center">
            <Phone className="h-5 w-5 mr-2" /> Emergency Support
          </h2>
          <p className="text-red-700 mb-4">
            If you're experiencing a mental health emergency or having thoughts of harming yourself,
            please reach out for immediate help.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-md p-4 border border-red-100">
              <h3 className="font-semibold text-gray-900 mb-1">National Suicide Prevention Lifeline</h3>
              <p className="text-gray-700 mb-2">24/7, free and confidential support</p>
              <p className="text-xl font-bold text-red-600">1-800-273-8255</p>
            </div>
            <div className="bg-white rounded-md p-4 border border-red-100">
              <h3 className="font-semibold text-gray-900 mb-1">Crisis Text Line</h3>
              <p className="text-gray-700 mb-2">Text HOME to 741741 to connect with a Crisis Counselor</p>
              <p className="font-bold text-red-600">Available 24/7</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Resource Categories */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <ResourceCategory 
          icon={<BookOpen className="h-6 w-6 text-purple-600" />}
          title="Educational Resources"
          description="Learn about mental health conditions, treatments, and coping strategies."
          color="purple"
        />
        <ResourceCategory 
          icon={<Users className="h-6 w-6 text-blue-600" />}
          title="Support Groups"
          description="Connect with others who share similar experiences and challenges."
          color="blue"
        />
        <ResourceCategory 
          icon={<Heart className="h-6 w-6 text-pink-600" />}
          title="Self-Care Practices"
          description="Discover activities and techniques to improve your mental wellbeing."
          color="pink"
        />
      </div>
      
      {/* Articles and Guides */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Articles & Guides</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <ResourceCard
          title="Understanding Depression"
          description="Learn about the symptoms, causes, and treatments for depression."
          link="#"
          tags={['Depression', 'Education']}
        />
        <ResourceCard
          title="Anxiety Management Techniques"
          description="Practical strategies to help manage anxiety in daily life."
          link="#"
          tags={['Anxiety', 'Coping Skills']}
        />
        <ResourceCard
          title="The Importance of Sleep for Mental Health"
          description="How quality sleep affects your mental wellbeing and tips for better rest."
          link="#"
          tags={['Sleep', 'Self-Care']}
        />
        <ResourceCard
          title="Mindfulness Meditation Guide"
          description="A beginner's guide to mindfulness practices for stress reduction."
          link="#"
          tags={['Mindfulness', 'Stress']}
        />
        <ResourceCard
          title="Building Resilience"
          description="Strategies to develop emotional resilience during challenging times."
          link="#"
          tags={['Resilience', 'Coping Skills']}
        />
        <ResourceCard
          title="Finding the Right Therapist"
          description="How to search for and select a mental health professional that fits your needs."
          link="#"
          tags={['Therapy', 'Resources']}
        />
      </div>
      
      {/* Professional Services */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Services</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <Card className="flex">
          <div className="bg-green-100 p-4 flex items-center justify-center">
            <Video className="h-8 w-8 text-green-600" />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Teletherapy Options</h3>
            <p className="text-gray-600 mb-4">
              Connect with licensed therapists from the comfort of your home through secure video sessions.
            </p>
            <ul className="text-sm text-gray-700 space-y-2 mb-4">
              <li className="flex items-start">
                <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                <span>Convenient scheduling options</span>
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                <span>HIPAA-compliant platforms</span>
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                <span>Many insurance plans accepted</span>
              </li>
            </ul>
            <a href="#" className="text-green-600 font-medium flex items-center hover:text-green-700">
              Find Providers <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>
        </Card>
        
        <Card className="flex">
          <div className="bg-blue-100 p-4 flex items-center justify-center">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Mental Health Centers</h3>
            <p className="text-gray-600 mb-4">
              Local centers offering affordable mental health services regardless of insurance status.
            </p>
            <ul className="text-sm text-gray-700 space-y-2 mb-4">
              <li className="flex items-start">
                <span className="h-5 w-5 text-blue-500 mr-2">✓</span>
                <span>Sliding scale payment options</span>
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 text-blue-500 mr-2">✓</span>
                <span>Individual and group therapy</span>
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 text-blue-500 mr-2">✓</span>
                <span>Psychiatric services available</span>
              </li>
            </ul>
            <a href="#" className="text-blue-600 font-medium flex items-center hover:text-blue-700">
              Find Centers Near You <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>
        </Card>
      </div>
      
      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-medium text-gray-900 mb-2">Disclaimer</p>
        <p>
          The resources provided on this page are for informational purposes only and are not intended as a substitute for 
          professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified 
          health provider with any questions you may have regarding a medical condition.
        </p>
      </div>
    </div>
  );
};

interface ResourceCategoryProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'purple' | 'pink' | 'green';
}

const ResourceCategory: React.FC<ResourceCategoryProps> = ({ icon, title, description, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100 hover:bg-blue-100',
    purple: 'bg-purple-50 border-purple-100 hover:bg-purple-100',
    pink: 'bg-pink-50 border-pink-100 hover:bg-pink-100',
    green: 'bg-green-50 border-green-100 hover:bg-green-100'
  };
  
  return (
    <div className={`rounded-lg border p-6 transition-colors ${colorClasses[color]}`}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface ResourceCardProps {
  title: string;
  description: string;
  link: string;
  tags: string[];
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, description, link, tags }) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="p-6 flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-100 p-4">
        <a 
          href={link}
          className="text-blue-600 font-medium flex items-center hover:text-blue-700"
        >
          Read More <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </div>
    </Card>
  );
};

export default ResourcesPage;
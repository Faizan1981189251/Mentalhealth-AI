import React from 'react';
import { Heart, Brain } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Brain className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-lg font-bold text-gray-900">MindPulse</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <p>Made with</p>
            <Heart className="h-4 w-4 text-red-500 mx-1" />
            <p>for mental wellbeing</p>
          </div>
          
          <nav className="flex space-x-4 mt-4 md:mt-0">
            <FooterLink href="#">Privacy</FooterLink>
            <FooterLink href="#">Terms</FooterLink>
            <FooterLink href="#">Contact</FooterLink>
          </nav>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-400">
          <p>The information provided on this application is for general informational purposes only and is not intended as a substitute for professional medical advice.</p>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => {
  return (
    <a 
      href={href}
      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      {children}
    </a>
  );
};

export default Footer;
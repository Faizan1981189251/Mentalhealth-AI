import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Shield, Heart } from 'lucide-react';
import AlertSystem from '../Therapist/AlertSystem';

interface HeaderProps {
  sessions?: any[];
}

const Header: React.FC<HeaderProps> = ({ sessions = [] }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-500 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">MindBridge Health</h1>
              <p className="text-xs text-gray-500">HIPAA-Compliant Mental Health Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-therapeutic-600" />
              <span className="text-sm text-gray-600">Secure Session</span>
            </div>
            
            {/* Alert System for Therapists */}
            {user?.role === 'therapist' && (
              <AlertSystem sessions={sessions} />
            )}
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
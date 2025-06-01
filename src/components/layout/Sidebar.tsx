import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, Brain, MessageSquare, BookOpen, Settings, AlertCircle } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  // Close sidebar on route change or when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [closeSidebar]);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      if (isOpen && sidebar && !sidebar.contains(e.target as Node)) {
        closeSidebar();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, closeSidebar]);
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden" />
      )}
      
      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-30 h-full w-64 transform bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col border-r border-gray-200">
          {/* Sidebar header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 lg:border-none">
            <div className="flex items-center">
              <Brain className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">MindPulse</span>
            </div>
            <button
              onClick={closeSidebar}
              className="text-gray-500 hover:text-gray-700 lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <NavItem to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />}>
              Dashboard
            </NavItem>
            <NavItem to="/emotion-detection" icon={<Brain className="h-5 w-5" />}>
              Emotion Detection
            </NavItem>
            <NavItem to="/chatbot" icon={<MessageSquare className="h-5 w-5" />}>
              AI Chatbot
            </NavItem>
            <NavItem to="/resources" icon={<BookOpen className="h-5 w-5" />}>
              Resources
            </NavItem>
            <NavItem to="/settings" icon={<Settings className="h-5 w-5" />}>
              Settings
            </NavItem>
          </nav>
          
          {/* Help section */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Need help?</h3>
                  <div className="mt-1 text-sm text-blue-700">
                    <p>If you're in crisis, please contact emergency services or a mental health professional immediately.</p>
                  </div>
                  <div className="mt-2">
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Crisis Resources →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {children}
    </NavLink>
  );
};

export default Sidebar;
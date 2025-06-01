import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <div className="flex flex-1">
        {user && (
          <Sidebar 
            isOpen={sidebarOpen} 
            closeSidebar={() => setSidebarOpen(false)} 
          />
        )}
        
        <main className={`flex-1 transition-all duration-200 ${user ? 'lg:ml-64' : ''}`}>
          <div className="min-h-[calc(100vh-64px-80px)]">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
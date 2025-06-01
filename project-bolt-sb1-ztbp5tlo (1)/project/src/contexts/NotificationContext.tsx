import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type: NotificationType) => void;
  dismissNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  showNotification: () => {},
  dismissNotification: () => {}
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const showNotification = useCallback((message: string, type: NotificationType) => {
    const id = Date.now().toString();
    
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 5000);
  }, []);
  
  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  return (
    <NotificationContext.Provider value={{ notifications, showNotification, dismissNotification }}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50 max-w-sm w-full">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg flex items-start transition-all duration-300 animate-slideIn ${
              notification.type === 'success' ? 'bg-green-50 text-green-800' :
              notification.type === 'error' ? 'bg-red-50 text-red-800' :
              notification.type === 'warning' ? 'bg-amber-50 text-amber-800' :
              'bg-blue-50 text-blue-800'
            }`}
            style={{ animationDuration: '300ms' }}
          >
            <div className="flex-shrink-0 mr-3">
              {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {notification.type === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
              {notification.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-500" />}
              {notification.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
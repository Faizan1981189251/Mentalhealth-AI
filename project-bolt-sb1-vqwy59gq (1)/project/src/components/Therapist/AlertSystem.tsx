import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Session } from '../../types';
import { AlertTriangle, Bell, X, Clock, User, TrendingUp, MessageCircle } from 'lucide-react';

interface Alert {
  id: string;
  patientId: string;
  type: 'high_risk' | 'critical' | 'behavioral_change' | 'missed_session';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  sessionId?: string;
}

interface AlertSystemProps {
  sessions: Session[];
}

const AlertSystem: React.FC<AlertSystemProps> = ({ sessions }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  useEffect(() => {
    generateAlerts();
  }, [sessions]);

  const generateAlerts = () => {
    const newAlerts: Alert[] = [];

    sessions.forEach(session => {
      // High risk score alert
      if (session.riskScore > 80) {
        newAlerts.push({
          id: `risk-${session.id}`,
          patientId: session.patientId,
          type: 'critical',
          severity: 'critical',
          title: 'Critical Risk Level Detected',
          message: `Patient ${session.patientId.slice(-4)} shows risk score of ${Math.round(session.riskScore)}%. Immediate attention required.`,
          timestamp: session.endTime || session.startTime,
          isRead: false,
          sessionId: session.id
        });
      } else if (session.riskScore > 70) {
        newAlerts.push({
          id: `risk-${session.id}`,
          patientId: session.patientId,
          type: 'high_risk',
          severity: 'high',
          title: 'High Risk Score Alert',
          message: `Patient ${session.patientId.slice(-4)} shows elevated risk score of ${Math.round(session.riskScore)}%.`,
          timestamp: session.endTime || session.startTime,
          isRead: false,
          sessionId: session.id
        });
      }

      // Behavioral change detection
      const negativeEmotions = session.emotionData.filter(e => 
        ['sad', 'angry', 'fear', 'disgust'].includes(e.emotion)
      );
      
      if (negativeEmotions.length > session.emotionData.length * 0.7) {
        newAlerts.push({
          id: `behavior-${session.id}`,
          patientId: session.patientId,
          type: 'behavioral_change',
          severity: 'medium',
          title: 'Concerning Emotional Pattern',
          message: `Patient ${session.patientId.slice(-4)} showing predominantly negative emotions (${Math.round(negativeEmotions.length / session.emotionData.length * 100)}%).`,
          timestamp: session.endTime || session.startTime,
          isRead: false,
          sessionId: session.id
        });
      }

      // Voice sentiment concerns
      const negativeVoice = session.voiceData.filter(v => v.sentiment === 'negative');
      if (negativeVoice.length > session.voiceData.length * 0.6) {
        newAlerts.push({
          id: `voice-${session.id}`,
          patientId: session.patientId,
          type: 'behavioral_change',
          severity: 'medium',
          title: 'Negative Voice Sentiment',
          message: `Patient ${session.patientId.slice(-4)} expressing predominantly negative sentiment in voice interactions.`,
          timestamp: session.endTime || session.startTime,
          isRead: false,
          sessionId: session.id
        });
      }
    });

    // Sort by timestamp (newest first) and remove duplicates
    const uniqueAlerts = newAlerts.filter((alert, index, self) => 
      index === self.findIndex(a => a.id === alert.id)
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setAlerts(uniqueAlerts);
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.isRead;
    if (filter === 'critical') return alert.severity === 'critical';
    return true;
  });

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.severity === 'critical').length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-danger-100 text-danger-700 border-danger-200';
      case 'high': return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'medium': return 'bg-primary-100 text-primary-700 border-primary-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertTriangle;
      case 'high_risk': return TrendingUp;
      case 'behavioral_change': return MessageCircle;
      case 'missed_session': return Clock;
      default: return Bell;
    }
  };

  return (
    <div className="relative">
      {/* Alert Bell Button */}
      <button
        onClick={() => setShowAlerts(!showAlerts)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Alert Panel */}
      <AnimatePresence>
        {showAlerts && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Patient Alerts
                </h3>
                <button
                  onClick={() => setShowAlerts(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Stats */}
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span className="text-gray-600">
                  {unreadCount} unread
                </span>
                {criticalCount > 0 && (
                  <span className="text-danger-600 font-medium">
                    {criticalCount} critical
                  </span>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1 mt-3">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'unread', label: 'Unread' },
                  { key: 'critical', label: 'Critical' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key as any)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === tab.key
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Alerts List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredAlerts.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No alerts to display</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredAlerts.map(alert => {
                    const IconComponent = getSeverityIcon(alert.type);
                    
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !alert.isRead ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {alert.title}
                              </h4>
                              <button
                                onClick={() => dismissAlert(alert.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {alert.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <User className="h-3 w-3" />
                                <span>Patient {alert.patientId.slice(-4)}</span>
                                <span>•</span>
                                <span>{new Date(alert.timestamp).toLocaleString()}</span>
                              </div>
                              
                              {!alert.isRead && (
                                <button
                                  onClick={() => markAsRead(alert.id)}
                                  className="text-xs text-primary-600 hover:text-primary-700"
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredAlerts.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })))}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlertSystem;
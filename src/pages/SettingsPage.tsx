import React, { useState } from 'react';
import { Save, Bell, Lock, User, Shield, Monitor, Moon, Sun } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [accountForm, setAccountForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    moodReminders: true,
    weeklyReports: true,
    resourceUpdates: false
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    shareDataForResearch: false,
    storeEmotionData: true,
    storeConversationHistory: true
  });
  
  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user's account information
    showNotification('Account settings updated successfully', 'success');
  };
  
  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update notification preferences
    showNotification('Notification preferences updated', 'success');
  };
  
  const handlePrivacySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update privacy settings
    showNotification('Privacy settings updated', 'success');
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account, privacy, and application preferences
        </p>
      </div>
      
      <div className="space-y-8">
        {/* Account Settings */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Account Settings
          </h2>
          <Card>
            <form onSubmit={handleAccountSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={accountForm.name}
                    onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={accountForm.email}
                    onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    onClick={() => showNotification('Password reset functionality would be implemented here', 'info')}
                  >
                    Change Password
                  </button>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                <Button type="submit" className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </section>
        
        {/* Notification Settings */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-amber-600" />
            Notification Preferences
          </h2>
          <Card>
            <form onSubmit={handleNotificationSubmit}>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive important updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notificationSettings.emailNotifications}
                      onChange={() => setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: !notificationSettings.emailNotifications
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Mood Check-in Reminders</h3>
                    <p className="text-sm text-gray-500">Get reminders to track your mood regularly</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notificationSettings.moodReminders}
                      onChange={() => setNotificationSettings({
                        ...notificationSettings,
                        moodReminders: !notificationSettings.moodReminders
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Weekly Progress Reports</h3>
                    <p className="text-sm text-gray-500">Receive weekly summaries of your emotional patterns</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notificationSettings.weeklyReports}
                      onChange={() => setNotificationSettings({
                        ...notificationSettings,
                        weeklyReports: !notificationSettings.weeklyReports
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Resource Updates</h3>
                    <p className="text-sm text-gray-500">Get notified about new mental health resources</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notificationSettings.resourceUpdates}
                      onChange={() => setNotificationSettings({
                        ...notificationSettings,
                        resourceUpdates: !notificationSettings.resourceUpdates
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                <Button type="submit" className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </form>
          </Card>
        </section>
        
        {/* Privacy Settings */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-600" />
            Privacy Settings
          </h2>
          <Card>
            <form onSubmit={handlePrivacySubmit}>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Share Data for Research</h3>
                    <p className="text-sm text-gray-500">Allow anonymized data to be used for mental health research</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={privacySettings.shareDataForResearch}
                      onChange={() => setPrivacySettings({
                        ...privacySettings,
                        shareDataForResearch: !privacySettings.shareDataForResearch
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Store Emotion Detection Data</h3>
                    <p className="text-sm text-gray-500">Save your facial emotion analysis results for tracking</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={privacySettings.storeEmotionData}
                      onChange={() => setPrivacySettings({
                        ...privacySettings,
                        storeEmotionData: !privacySettings.storeEmotionData
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Store Conversation History</h3>
                    <p className="text-sm text-gray-500">Save your chat conversations for future reference</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={privacySettings.storeConversationHistory}
                      onChange={() => setPrivacySettings({
                        ...privacySettings,
                        storeConversationHistory: !privacySettings.storeConversationHistory
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                    onClick={() => showNotification('This would delete all your data - not implemented in this demo', 'warning')}
                  >
                    Delete All My Data
                  </button>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                <Button type="submit" className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Save Privacy Settings
                </Button>
              </div>
            </form>
          </Card>
        </section>
        
        {/* Theme Settings */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Monitor className="h-5 w-5 mr-2 text-purple-600" />
            Appearance
          </h2>
          <Card>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="theme-light"
                    name="theme"
                    type="radio"
                    checked={theme === 'light'}
                    onChange={() => setTheme('light')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="theme-light" className="ml-3 flex items-center">
                    <Sun className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Light Mode</span>
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="theme-dark"
                    name="theme"
                    type="radio"
                    checked={theme === 'dark'}
                    onChange={() => setTheme('dark')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="theme-dark" className="ml-3 flex items-center">
                    <Moon className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Dark Mode</span>
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="theme-system"
                    name="theme"
                    type="radio"
                    checked={theme === 'system'}
                    onChange={() => setTheme('system')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="theme-system" className="ml-3 flex items-center">
                    <Monitor className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">System Preference</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                Choose how MindPulse appears to you. Select a light or dark theme, or follow your system settings.
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
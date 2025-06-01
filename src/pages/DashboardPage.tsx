import React, { useState } from 'react';
import { Calendar, TrendingUp, Activity, Clock, BarChart } from 'lucide-react';
import Card from '../components/ui/Card';
import { EmotionChart } from '../components/charts/EmotionChart';
import { WeeklyMoodChart } from '../components/charts/WeeklyMoodChart';
import { mockUserData, mockWeeklyMoodData, mockEmotionBreakdown } from '../services/mockData';
import { formatDate } from '../utils/dateUtils';

const DashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const userData = mockUserData();
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wellness Dashboard</h1>
        <p className="text-gray-600">
          Track your emotional patterns and progress over time
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard 
          title="Current Mood"
          value={userData.currentMood.label}
          icon={<Activity className="h-6 w-6 text-blue-500" />}
          trend={userData.currentMood.change}
          description={`Based on your latest ${userData.currentMood.source}`}
        />
        <SummaryCard 
          title="Streak"
          value={`${userData.streak} days`}
          icon={<Calendar className="h-6 w-6 text-green-500" />}
          trend={null}
          description="Consecutive days of tracking"
        />
        <SummaryCard 
          title="Emotional Variety"
          value={userData.emotionalVariety.score}
          icon={<BarChart className="h-6 w-6 text-purple-500" />}
          trend={userData.emotionalVariety.change}
          description={userData.emotionalVariety.description}
        />
        <SummaryCard 
          title="Last Check-in"
          value={formatDate(userData.lastCheckIn)}
          icon={<Clock className="h-6 w-6 text-amber-500" />}
          trend={null}
          description={`${userData.daysSinceCheckIn} days ago`}
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Mood Trends</h2>
              <div className="flex space-x-2">
                <TimeRangeButton 
                  active={timeRange === 'week'} 
                  onClick={() => setTimeRange('week')}
                >
                  Week
                </TimeRangeButton>
                <TimeRangeButton 
                  active={timeRange === 'month'} 
                  onClick={() => setTimeRange('month')}
                >
                  Month
                </TimeRangeButton>
                <TimeRangeButton 
                  active={timeRange === 'year'} 
                  onClick={() => setTimeRange('year')}
                >
                  Year
                </TimeRangeButton>
              </div>
            </div>
          </div>
          <div className="p-4">
            <WeeklyMoodChart data={mockWeeklyMoodData(timeRange)} />
          </div>
        </Card>
        
        <Card>
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Emotion Breakdown</h2>
          </div>
          <div className="p-4">
            <EmotionChart data={mockEmotionBreakdown()} />
          </div>
        </Card>
      </div>
      
      {/* Insights Section */}
      <Card>
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Recent Insights</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {userData.insights.map((insight, index) => (
            <div key={index} className="p-4">
              <div className="flex items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  insight.type === 'positive' 
                    ? 'bg-green-100 text-green-600' 
                    : insight.type === 'negative' 
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{insight.title}</h3>
                  <p className="text-gray-600 mt-1">{insight.description}</p>
                  <div className="mt-2 text-sm text-gray-500">{formatDate(insight.date)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: number | null;
  description: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, trend, description }) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="mr-3">{icon}</div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="mt-1 text-xl font-semibold text-gray-900">{value}</div>
          </div>
        </div>
        {trend !== null && (
          <div className={`flex items-center ${
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            <TrendingUp className={`h-4 w-4 mr-1 ${trend < 0 ? 'transform rotate-180' : ''}`} />
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </Card>
  );
};

interface TimeRangeButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TimeRangeButton: React.FC<TimeRangeButtonProps> = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`text-sm px-3 py-1 rounded-md ${
        active 
          ? 'bg-blue-100 text-blue-700 font-medium' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
};

export default DashboardPage;
import React from 'react';
import { motion } from 'framer-motion';
import { Session } from '../../types';
import { AlertTriangle, TrendingUp, TrendingDown, Shield, Activity } from 'lucide-react';

interface RiskAssessmentProps {
  sessions: Session[];
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ sessions }) => {
  // Calculate risk metrics
  const calculateRiskMetrics = () => {
    if (sessions.length === 0) {
      return {
        currentRisk: 0,
        riskTrend: 0,
        highRiskSessions: 0,
        criticalAlerts: 0,
        riskFactors: {
          emotionalInstability: 0,
          negativeVoiceSentiment: 0,
          behavioralConcerns: 0
        }
      };
    }

    const currentRisk = sessions[sessions.length - 1]?.riskScore || 0;
    const previousRisk = sessions[sessions.length - 2]?.riskScore || currentRisk;
    const riskTrend = currentRisk - previousRisk;
    
    const highRiskSessions = sessions.filter(s => s.riskScore > 70).length;
    const criticalAlerts = sessions.filter(s => s.riskScore > 85).length;

    // Analyze emotional patterns
    const allEmotions = sessions.flatMap(s => s.emotionData);
    const negativeEmotions = allEmotions.filter(e => 
      ['sad', 'angry', 'fear', 'disgust'].includes(e.emotion)
    );
    const emotionalInstability = (negativeEmotions.length / Math.max(allEmotions.length, 1)) * 100;

    // Analyze voice sentiment
    const allVoiceData = sessions.flatMap(s => s.voiceData);
    const negativeVoice = allVoiceData.filter(v => v.sentiment === 'negative');
    const negativeVoiceSentiment = (negativeVoice.length / Math.max(allVoiceData.length, 1)) * 100;

    // Behavioral concerns (simplified)
    const behavioralConcerns = Math.min(highRiskSessions * 10, 100);

    return {
      currentRisk,
      riskTrend,
      highRiskSessions,
      criticalAlerts,
      riskFactors: {
        emotionalInstability,
        negativeVoiceSentiment,
        behavioralConcerns
      }
    };
  };

  const metrics = calculateRiskMetrics();

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'therapeutic', bgColor: 'bg-therapeutic-50', textColor: 'text-therapeutic-700' };
    if (score < 70) return { level: 'Moderate', color: 'warning', bgColor: 'bg-warning-50', textColor: 'text-warning-700' };
    return { level: 'High', color: 'danger', bgColor: 'bg-danger-50', textColor: 'text-danger-700' };
  };

  const currentRiskLevel = getRiskLevel(metrics.currentRisk);

  const riskFactors = [
    {
      name: 'Emotional Instability',
      value: metrics.riskFactors.emotionalInstability,
      description: 'Frequency of negative emotions detected',
      icon: Activity
    },
    {
      name: 'Voice Sentiment',
      value: metrics.riskFactors.negativeVoiceSentiment,
      description: 'Negative sentiment in voice interactions',
      icon: TrendingDown
    },
    {
      name: 'Behavioral Patterns',
      value: metrics.riskFactors.behavioralConcerns,
      description: 'Concerning behavioral indicators',
      icon: AlertTriangle
    }
  ];

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No session data available for risk assessment</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${currentRiskLevel.bgColor} rounded-xl p-6 border border-${currentRiskLevel.color}-200`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${currentRiskLevel.textColor}`}>Current Risk Level</h3>
            <Shield className={`h-5 w-5 ${currentRiskLevel.textColor}`} />
          </div>
          <div className="flex items-end space-x-2">
            <p className={`text-3xl font-bold ${currentRiskLevel.textColor}`}>
              {Math.round(metrics.currentRisk)}%
            </p>
            <p className={`text-sm font-medium ${currentRiskLevel.textColor}`}>
              {currentRiskLevel.level}
            </p>
          </div>
          <div className="flex items-center mt-2">
            {metrics.riskTrend !== 0 && (
              <>
                {metrics.riskTrend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-danger-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-therapeutic-600 mr-1" />
                )}
                <span className={`text-sm ${
                  metrics.riskTrend > 0 ? 'text-danger-600' : 'text-therapeutic-600'
                }`}>
                  {metrics.riskTrend > 0 ? '+' : ''}{Math.round(metrics.riskTrend)}% from last session
                </span>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">High Risk Sessions</h3>
            <AlertTriangle className="h-5 w-5 text-danger-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.highRiskSessions}</p>
          <p className="text-sm text-gray-600">Out of {sessions.length} total sessions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Critical Alerts</h3>
            <AlertTriangle className="h-5 w-5 text-danger-600" />
          </div>
          <p className="text-3xl font-bold text-danger-600">{metrics.criticalAlerts}</p>
          <p className="text-sm text-gray-600">Requires immediate attention</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Assessment Date</h3>
            <Activity className="h-5 w-5 text-primary-500" />
          </div>
          <p className="text-lg font-bold text-gray-900">
            {new Date().toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">Last updated</p>
        </motion.div>
      </div>

      {/* Risk Factors Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Factors Analysis</h3>
        <div className="space-y-6">
          {riskFactors.map((factor, index) => {
            const FactorIcon = factor.icon;
            const riskLevel = getRiskLevel(factor.value);
            
            return (
              <motion.div
                key={factor.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg bg-${riskLevel.color}-100`}>
                    <FactorIcon className={`h-5 w-5 text-${riskLevel.color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{factor.name}</h4>
                    <p className="text-sm text-gray-600">{factor.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-${riskLevel.color}-500 transition-all duration-300`}
                      style={{ width: `${Math.min(factor.value, 100)}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {Math.round(factor.value)}%
                    </p>
                    <p className={`text-xs ${riskLevel.textColor}`}>
                      {riskLevel.level}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-50 to-therapeutic-50 rounded-xl p-6 border border-primary-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Recommendations</h3>
        <div className="space-y-3">
          {metrics.currentRisk > 70 && (
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-danger-600 mt-0.5" />
              <p className="text-sm text-gray-700">
                <strong>High Risk Alert:</strong> Consider immediate intervention and increased monitoring frequency.
              </p>
            </div>
          )}
          
          {metrics.riskFactors.emotionalInstability > 50 && (
            <div className="flex items-start space-x-3">
              <Activity className="h-5 w-5 text-warning-600 mt-0.5" />
              <p className="text-sm text-gray-700">
                <strong>Emotional Support:</strong> Focus on emotional regulation techniques and coping strategies.
              </p>
            </div>
          )}
          
          {metrics.riskFactors.negativeVoiceSentiment > 40 && (
            <div className="flex items-start space-x-3">
              <TrendingDown className="h-5 w-5 text-primary-600 mt-0.5" />
              <p className="text-sm text-gray-700">
                <strong>Communication Patterns:</strong> Address negative thought patterns and cognitive distortions.
              </p>
            </div>
          )}
          
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-therapeutic-600 mt-0.5" />
            <p className="text-sm text-gray-700">
              <strong>Ongoing Monitoring:</strong> Continue regular sessions and maintain open communication channels.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RiskAssessment;
import React from 'react';
import { motion } from 'framer-motion';
import { Session } from '../../types';
import { AlertTriangle, Brain, Heart, TrendingDown, TrendingUp, Activity, Shield } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DepressionAssessmentProps {
  session: Session;
}

const DepressionAssessment: React.FC<DepressionAssessmentProps> = ({ session }) => {
  // Calculate depression indicators
  const calculateDepressionMetrics = () => {
    const negativeEmotions = session.emotionData.filter(e => 
      ['sad', 'angry', 'fear', 'disgust'].includes(e.emotion)
    );
    const positiveEmotions = session.emotionData.filter(e => 
      ['happy', 'surprised'].includes(e.emotion)
    );
    
    const negativeVoice = session.voiceData.filter(v => v.sentiment === 'negative');
    const positiveVoice = session.voiceData.filter(v => v.sentiment === 'positive');
    
    const emotionalNegativity = session.emotionData.length > 0 
      ? (negativeEmotions.length / session.emotionData.length) * 100 
      : 0;
    
    const voiceNegativity = session.voiceData.length > 0 
      ? (negativeVoice.length / session.voiceData.length) * 100 
      : 0;
    
    const emotionalVariability = session.emotionData.length > 1 
      ? calculateVariability(session.emotionData.map(e => e.intensity)) * 100
      : 0;
    
    const avgStressLevel = session.voiceData.length > 0 
      ? (session.voiceData.reduce((sum, v) => sum + v.stressLevel, 0) / session.voiceData.length) * 100
      : 0;

    return {
      emotionalNegativity,
      voiceNegativity,
      emotionalVariability,
      avgStressLevel,
      positiveEmotionRatio: session.emotionData.length > 0 ? (positiveEmotions.length / session.emotionData.length) * 100 : 0,
      positiveVoiceRatio: session.voiceData.length > 0 ? (positiveVoice.length / session.voiceData.length) * 100 : 0
    };
  };

  const calculateVariability = (values: number[]): number => {
    if (values.length < 2) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  };

  const metrics = calculateDepressionMetrics();

  // Depression severity assessment
  const getDepressionSeverity = (riskScore: number) => {
    if (riskScore >= 85) return {
      level: 'Severe Depression',
      color: 'danger',
      description: 'Significant symptoms requiring immediate professional intervention',
      recommendations: [
        'Immediate psychiatric evaluation required',
        'Consider inpatient treatment options',
        'Daily monitoring and support',
        'Medication review with psychiatrist',
        'Crisis intervention plan activation'
      ]
    };
    
    if (riskScore >= 65) return {
      level: 'Moderate-Severe Depression',
      color: 'warning',
      description: 'Substantial symptoms significantly impacting daily functioning',
      recommendations: [
        'Intensive outpatient therapy (2-3 sessions/week)',
        'Psychiatric consultation for medication',
        'Weekly progress monitoring',
        'Family/support system involvement',
        'Structured daily activity planning'
      ]
    };
    
    if (riskScore >= 45) return {
      level: 'Moderate Depression',
      color: 'primary',
      description: 'Notable symptoms affecting mood and daily activities',
      recommendations: [
        'Regular therapy sessions (weekly)',
        'Consider antidepressant medication',
        'Cognitive behavioral therapy (CBT)',
        'Exercise and lifestyle modifications',
        'Bi-weekly progress assessments'
      ]
    };
    
    if (riskScore >= 25) return {
      level: 'Mild Depression',
      color: 'warning',
      description: 'Some symptoms present but manageable with support',
      recommendations: [
        'Bi-weekly counseling sessions',
        'Mindfulness and stress reduction techniques',
        'Regular exercise routine',
        'Sleep hygiene improvement',
        'Social support network strengthening'
      ]
    };
    
    return {
      level: 'Minimal/No Depression',
      color: 'therapeutic',
      description: 'Few or no depressive symptoms detected',
      recommendations: [
        'Continue current coping strategies',
        'Maintain regular self-care routine',
        'Monthly check-ins for prevention',
        'Stress management techniques',
        'Healthy lifestyle maintenance'
      ]
    };
  };

  const severity = getDepressionSeverity(session.riskScore);

  // Risk factors data for chart
  const riskFactorsData = [
    { factor: 'Emotional Negativity', value: metrics.emotionalNegativity, threshold: 60 },
    { factor: 'Voice Negativity', value: metrics.voiceNegativity, threshold: 50 },
    { factor: 'Stress Level', value: metrics.avgStressLevel, threshold: 70 },
    { factor: 'Emotional Instability', value: metrics.emotionalVariability, threshold: 40 }
  ];

  // Protective factors
  const protectiveFactorsData = [
    { factor: 'Positive Emotions', value: metrics.positiveEmotionRatio },
    { factor: 'Positive Voice', value: metrics.positiveVoiceRatio },
    { factor: 'Emotional Stability', value: Math.max(0, 100 - metrics.emotionalVariability) },
    { factor: 'Low Stress', value: Math.max(0, 100 - metrics.avgStressLevel) }
  ];

  const radialData = [
    { name: 'Depression Risk', value: session.riskScore, fill: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Depression Severity Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r from-${severity.color}-50 to-white rounded-xl p-6 border-2 border-${severity.color}-200`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold text-${severity.color}-700 mb-2`}>
              {severity.level}
            </h2>
            <p className="text-gray-700 text-lg">{severity.description}</p>
            <div className="mt-4 flex items-center space-x-4">
              <div className={`bg-${severity.color}-100 px-4 py-2 rounded-lg`}>
                <span className={`text-${severity.color}-700 font-semibold`}>
                  Risk Score: {Math.round(session.riskScore)}%
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Assessment Date: {new Date(session.startTime).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData}>
                  <RadialBar dataKey="value" cornerRadius={10} fill="#EF4444" />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-2">Depression Risk</p>
          </div>
        </div>
      </motion.div>

      {/* Risk Factors Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-danger-600 mr-2" />
            Risk Factors
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskFactorsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="factor" type="category" stroke="#6b7280" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#EF4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 text-therapeutic-600 mr-2" />
            Protective Factors
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={protectiveFactorsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="factor" type="category" stroke="#6b7280" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Detailed Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Depression Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Emotional Negativity',
              value: metrics.emotionalNegativity,
              icon: Brain,
              color: metrics.emotionalNegativity > 60 ? 'danger' : metrics.emotionalNegativity > 30 ? 'warning' : 'therapeutic',
              description: 'Percentage of negative emotions detected'
            },
            {
              title: 'Voice Sentiment',
              value: metrics.voiceNegativity,
              icon: Heart,
              color: metrics.voiceNegativity > 50 ? 'danger' : metrics.voiceNegativity > 25 ? 'warning' : 'therapeutic',
              description: 'Negative sentiment in voice interactions'
            },
            {
              title: 'Stress Level',
              value: metrics.avgStressLevel,
              icon: Activity,
              color: metrics.avgStressLevel > 70 ? 'danger' : metrics.avgStressLevel > 40 ? 'warning' : 'therapeutic',
              description: 'Average stress level detected in voice'
            },
            {
              title: 'Emotional Variability',
              value: metrics.emotionalVariability,
              icon: TrendingUp,
              color: metrics.emotionalVariability > 40 ? 'danger' : metrics.emotionalVariability > 20 ? 'warning' : 'therapeutic',
              description: 'Emotional instability and mood swings'
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`border-2 border-${metric.color}-200 rounded-xl p-4`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`bg-${metric.color}-100 p-2 rounded-lg`}>
                  <metric.icon className={`h-5 w-5 text-${metric.color}-600`} />
                </div>
                <span className={`text-2xl font-bold text-${metric.color}-600`}>
                  {Math.round(metric.value)}%
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{metric.title}</h4>
              <p className="text-xs text-gray-600">{metric.description}</p>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-${metric.color}-500 transition-all duration-300`}
                    style={{ width: `${Math.min(metric.value, 100)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Clinical Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Assessment Summary</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Key Findings</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className={`bg-${severity.color}-100 p-1 rounded-full mt-1`}>
                  <AlertTriangle className={`h-3 w-3 text-${severity.color}-600`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Depression Severity</p>
                  <p className="text-sm text-gray-600">{severity.level} with {Math.round(session.riskScore)}% risk score</p>
                </div>
              </div>
              
              {metrics.emotionalNegativity > 60 && (
                <div className="flex items-start space-x-3">
                  <div className="bg-danger-100 p-1 rounded-full mt-1">
                    <Brain className="h-3 w-3 text-danger-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">High Emotional Negativity</p>
                    <p className="text-sm text-gray-600">
                      {Math.round(metrics.emotionalNegativity)}% of emotions were negative
                    </p>
                  </div>
                </div>
              )}
              
              {metrics.avgStressLevel > 50 && (
                <div className="flex items-start space-x-3">
                  <div className="bg-warning-100 p-1 rounded-full mt-1">
                    <Activity className="h-3 w-3 text-warning-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Elevated Stress</p>
                    <p className="text-sm text-gray-600">
                      Average stress level of {Math.round(metrics.avgStressLevel)}%
                    </p>
                  </div>
                </div>
              )}
              
              {metrics.positiveEmotionRatio > 30 && (
                <div className="flex items-start space-x-3">
                  <div className="bg-therapeutic-100 p-1 rounded-full mt-1">
                    <Heart className="h-3 w-3 text-therapeutic-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Positive Indicators</p>
                    <p className="text-sm text-gray-600">
                      {Math.round(metrics.positiveEmotionRatio)}% positive emotions detected
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Risk Assessment</h4>
            <div className="space-y-2">
              {riskFactorsData.map(factor => (
                <div key={factor.factor} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{factor.factor}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          factor.value > factor.threshold ? 'bg-danger-500' : 
                          factor.value > factor.threshold * 0.7 ? 'bg-warning-500' : 
                          'bg-therapeutic-500'
                        }`}
                        style={{ width: `${Math.min(factor.value, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">
                      {Math.round(factor.value)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DepressionAssessment;
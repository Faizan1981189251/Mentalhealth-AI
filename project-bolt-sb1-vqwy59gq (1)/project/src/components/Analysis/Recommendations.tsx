import React from 'react';
import { motion } from 'framer-motion';
import { Session } from '../../types';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Heart, 
  Brain, 
  Activity, 
  Phone, 
  Calendar,
  Users,
  Pill,
  BookOpen,
  Sun
} from 'lucide-react';

interface RecommendationsProps {
  session: Session;
}

const Recommendations: React.FC<RecommendationsProps> = ({ session }) => {
  const getDepressionLevel = (riskScore: number) => {
    if (riskScore >= 85) return 'severe';
    if (riskScore >= 65) return 'moderate-severe';
    if (riskScore >= 45) return 'moderate';
    if (riskScore >= 25) return 'mild';
    return 'minimal';
  };

  const level = getDepressionLevel(session.riskScore);

  const recommendations = {
    severe: {
      immediate: [
        {
          icon: Phone,
          title: 'Emergency Contact',
          description: 'Contact crisis hotline or emergency services immediately',
          priority: 'critical',
          action: 'Call 988 (Suicide & Crisis Lifeline) or 911'
        },
        {
          icon: AlertTriangle,
          title: 'Psychiatric Evaluation',
          description: 'Schedule immediate psychiatric assessment',
          priority: 'critical',
          action: 'Contact psychiatrist within 24 hours'
        },
        {
          icon: Users,
          title: 'Support System Activation',
          description: 'Notify family/friends for immediate support',
          priority: 'high',
          action: 'Contact emergency contacts'
        }
      ],
      shortTerm: [
        {
          icon: Pill,
          title: 'Medication Review',
          description: 'Urgent medication evaluation and adjustment',
          timeframe: '1-3 days'
        },
        {
          icon: Calendar,
          title: 'Daily Check-ins',
          description: 'Implement daily monitoring and support',
          timeframe: 'Daily for 2 weeks'
        },
        {
          icon: Brain,
          title: 'Intensive Therapy',
          description: 'Begin intensive outpatient program',
          timeframe: 'Within 1 week'
        }
      ],
      longTerm: [
        {
          icon: Heart,
          title: 'Comprehensive Treatment Plan',
          description: 'Develop multi-modal treatment approach'
        },
        {
          icon: Users,
          title: 'Family Therapy',
          description: 'Include family in treatment planning'
        },
        {
          icon: Activity,
          title: 'Structured Activities',
          description: 'Implement daily structure and routine'
        }
      ],
      avoid: [
        'Being alone for extended periods',
        'Making major life decisions',
        'Alcohol or substance use',
        'Isolating from support systems',
        'Skipping medications or appointments'
      ]
    },
    'moderate-severe': {
      immediate: [
        {
          icon: Calendar,
          title: 'Schedule Therapy',
          description: 'Book therapy session within 48 hours',
          priority: 'high',
          action: 'Contact therapist immediately'
        },
        {
          icon: Phone,
          title: 'Crisis Plan Review',
          description: 'Review and update crisis intervention plan',
          priority: 'high',
          action: 'Discuss with therapist'
        },
        {
          icon: Users,
          title: 'Support Network',
          description: 'Reach out to trusted friends or family',
          priority: 'medium',
          action: 'Make contact within 24 hours'
        }
      ],
      shortTerm: [
        {
          icon: Brain,
          title: 'Therapy Sessions',
          description: 'Attend therapy 2-3 times per week',
          timeframe: '2-4 weeks'
        },
        {
          icon: Pill,
          title: 'Medication Consultation',
          description: 'Discuss medication options with doctor',
          timeframe: 'Within 1 week'
        },
        {
          icon: Activity,
          title: 'Structured Routine',
          description: 'Establish daily routine and activities',
          timeframe: 'Start immediately'
        }
      ],
      longTerm: [
        {
          icon: BookOpen,
          title: 'CBT Program',
          description: 'Engage in cognitive behavioral therapy'
        },
        {
          icon: Sun,
          title: 'Lifestyle Changes',
          description: 'Implement exercise and nutrition plan'
        },
        {
          icon: Heart,
          title: 'Stress Management',
          description: 'Learn and practice stress reduction techniques'
        }
      ],
      avoid: [
        'Excessive alcohol consumption',
        'Social isolation',
        'Overcommitting to responsibilities',
        'Negative self-talk patterns',
        'Skipping therapy sessions'
      ]
    },
    moderate: {
      immediate: [
        {
          icon: Calendar,
          title: 'Therapy Appointment',
          description: 'Schedule therapy session within a week',
          priority: 'medium',
          action: 'Contact mental health provider'
        },
        {
          icon: Activity,
          title: 'Self-Care Plan',
          description: 'Implement immediate self-care strategies',
          priority: 'medium',
          action: 'Start today'
        }
      ],
      shortTerm: [
        {
          icon: Brain,
          title: 'Weekly Therapy',
          description: 'Attend regular therapy sessions',
          timeframe: '4-6 weeks'
        },
        {
          icon: Sun,
          title: 'Exercise Routine',
          description: 'Begin regular physical activity',
          timeframe: 'Start within 3 days'
        },
        {
          icon: Heart,
          title: 'Mindfulness Practice',
          description: 'Learn mindfulness and meditation',
          timeframe: '2-3 weeks'
        }
      ],
      longTerm: [
        {
          icon: BookOpen,
          title: 'Therapy Program',
          description: 'Complete structured therapy program'
        },
        {
          icon: Users,
          title: 'Support Groups',
          description: 'Join peer support groups'
        },
        {
          icon: Activity,
          title: 'Healthy Habits',
          description: 'Maintain consistent healthy lifestyle'
        }
      ],
      avoid: [
        'Excessive stress and pressure',
        'Irregular sleep patterns',
        'Social withdrawal',
        'Negative thinking spirals',
        'Procrastination on treatment'
      ]
    },
    mild: {
      immediate: [
        {
          icon: Heart,
          title: 'Self-Assessment',
          description: 'Monitor mood and symptoms daily',
          priority: 'low',
          action: 'Use mood tracking app'
        },
        {
          icon: Activity,
          title: 'Increase Activity',
          description: 'Engage in enjoyable activities',
          priority: 'medium',
          action: 'Plan activities for this week'
        }
      ],
      shortTerm: [
        {
          icon: Sun,
          title: 'Exercise Program',
          description: 'Start regular exercise routine',
          timeframe: '1-2 weeks'
        },
        {
          icon: Brain,
          title: 'Counseling',
          description: 'Consider bi-weekly counseling',
          timeframe: '2-4 weeks'
        },
        {
          icon: Users,
          title: 'Social Connection',
          description: 'Strengthen social relationships',
          timeframe: 'Ongoing'
        }
      ],
      longTerm: [
        {
          icon: BookOpen,
          title: 'Self-Help Resources',
          description: 'Utilize self-help books and apps'
        },
        {
          icon: Heart,
          title: 'Stress Management',
          description: 'Develop stress coping strategies'
        },
        {
          icon: Activity,
          title: 'Lifestyle Optimization',
          description: 'Maintain healthy lifestyle habits'
        }
      ],
      avoid: [
        'Ignoring symptoms',
        'Excessive work stress',
        'Poor sleep hygiene',
        'Social isolation',
        'Unhealthy coping mechanisms'
      ]
    },
    minimal: {
      immediate: [
        {
          icon: CheckCircle,
          title: 'Continue Current Strategies',
          description: 'Maintain current positive coping methods',
          priority: 'low',
          action: 'Keep up good work'
        }
      ],
      shortTerm: [
        {
          icon: Heart,
          title: 'Prevention Focus',
          description: 'Maintain mental health awareness',
          timeframe: 'Ongoing'
        },
        {
          icon: Activity,
          title: 'Healthy Lifestyle',
          description: 'Continue healthy habits',
          timeframe: 'Daily'
        }
      ],
      longTerm: [
        {
          icon: Brain,
          title: 'Mental Health Education',
          description: 'Learn about mental health maintenance'
        },
        {
          icon: Users,
          title: 'Support Network',
          description: 'Maintain strong social connections'
        },
        {
          icon: Sun,
          title: 'Wellness Routine',
          description: 'Regular self-care and wellness practices'
        }
      ],
      avoid: [
        'Complacency about mental health',
        'Excessive stress accumulation',
        'Neglecting self-care',
        'Isolation during difficult times',
        'Ignoring early warning signs'
      ]
    }
  };

  const currentRecommendations = recommendations[level];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      default: return 'therapeutic';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Treatment Recommendations
        </h2>
        <p className="text-gray-600">
          Based on the depression assessment showing <strong>{level.replace('-', ' ')} level</strong> symptoms 
          with a risk score of <strong>{Math.round(session.riskScore)}%</strong>
        </p>
      </motion.div>

      {/* Immediate Actions */}
      {currentRecommendations.immediate && currentRecommendations.immediate.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-6 w-6 text-danger-600 mr-2" />
            Immediate Actions Required
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentRecommendations.immediate.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`border-2 border-${getPriorityColor(item.priority)}-200 rounded-xl p-4 bg-${getPriorityColor(item.priority)}-50`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`bg-${getPriorityColor(item.priority)}-100 p-2 rounded-lg`}>
                    <item.icon className={`h-5 w-5 text-${getPriorityColor(item.priority)}-600`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    {item.action && (
                      <p className={`text-sm font-medium text-${getPriorityColor(item.priority)}-700`}>
                        Action: {item.action}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Short-term Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-6 w-6 text-primary-600 mr-2" />
          Short-term Treatment Plan (1-4 weeks)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentRecommendations.shortTerm.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-3">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <item.icon className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  {item.timeframe && (
                    <span className="inline-block bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">
                      {item.timeframe}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Long-term Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Heart className="h-6 w-6 text-therapeutic-600 mr-2" />
          Long-term Recovery Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentRecommendations.longTerm.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-3">
                <div className="bg-therapeutic-100 p-2 rounded-lg">
                  <item.icon className="h-5 w-5 text-therapeutic-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* What to Avoid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <XCircle className="h-6 w-6 text-danger-600 mr-2" />
          What to Avoid
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentRecommendations.avoid.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-3 p-3 bg-danger-50 border border-danger-200 rounded-lg"
            >
              <XCircle className="h-5 w-5 text-danger-600 flex-shrink-0" />
              <span className="text-sm text-danger-700">{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Emergency Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-danger-50 to-warning-50 rounded-xl p-6 border border-danger-200"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Phone className="h-6 w-6 text-danger-600 mr-2" />
          Emergency Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Crisis Hotlines</h4>
            <div className="space-y-2 text-sm">
              <div>
                <strong>988 Suicide & Crisis Lifeline</strong>
                <p className="text-gray-600">24/7 free and confidential support</p>
              </div>
              <div>
                <strong>Crisis Text Line: Text HOME to 741741</strong>
                <p className="text-gray-600">24/7 crisis support via text</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Emergency Services</h4>
            <div className="space-y-2 text-sm">
              <div>
                <strong>911</strong>
                <p className="text-gray-600">For immediate medical emergencies</p>
              </div>
              <div>
                <strong>Local Emergency Room</strong>
                <p className="text-gray-600">For psychiatric emergencies</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Follow-up Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-6 w-6 text-primary-600 mr-2" />
          Recommended Follow-up Schedule
        </h3>
        <div className="space-y-3">
          {level === 'severe' && (
            <>
              <div className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                <span className="font-medium">Daily check-ins</span>
                <span className="text-sm text-danger-600">Next 2 weeks</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                <span className="font-medium">Psychiatric evaluation</span>
                <span className="text-sm text-warning-600">Within 24 hours</span>
              </div>
            </>
          )}
          {(level === 'moderate-severe' || level === 'moderate') && (
            <>
              <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                <span className="font-medium">Therapy sessions</span>
                <span className="text-sm text-primary-600">Weekly</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-therapeutic-50 rounded-lg">
                <span className="font-medium">Progress assessment</span>
                <span className="text-sm text-therapeutic-600">Bi-weekly</span>
              </div>
            </>
          )}
          {level === 'mild' && (
            <div className="flex items-center justify-between p-3 bg-therapeutic-50 rounded-lg">
              <span className="font-medium">Counseling sessions</span>
              <span className="text-sm text-therapeutic-600">Bi-weekly</span>
            </div>
          )}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Next assessment</span>
            <span className="text-sm text-gray-600">4 weeks</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Recommendations;
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, AlertCircle, Shield } from 'lucide-react';

interface RiskIndicatorProps {
  riskScore: number;
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({ riskScore }) => {
  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'therapeutic', icon: CheckCircle };
    if (score < 70) return { level: 'Moderate', color: 'warning', icon: AlertCircle };
    return { level: 'High', color: 'danger', icon: AlertTriangle };
  };

  const risk = getRiskLevel(riskScore);
  const RiskIcon = risk.icon;

  const colorClasses = {
    therapeutic: {
      bg: 'bg-therapeutic-100',
      text: 'text-therapeutic-700',
      border: 'border-therapeutic-200'
    },
    warning: {
      bg: 'bg-warning-100',
      text: 'text-warning-700',
      border: 'border-warning-200'
    },
    danger: {
      bg: 'bg-danger-100',
      text: 'text-danger-700',
      border: 'border-danger-200'
    }
  };

  const classes = colorClasses[risk.color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg border ${classes.bg} ${classes.border}`}
    >
      <div className="flex items-center space-x-2">
        <Shield className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">Risk Level:</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <RiskIcon className={`h-5 w-5 ${classes.text}`} />
        <span className={`font-semibold ${classes.text}`}>
          {risk.level}
        </span>
        <span className={`text-sm ${classes.text}`}>
          ({Math.round(riskScore)}%)
        </span>
      </div>
    </motion.div>
  );
};

export default RiskIndicator;
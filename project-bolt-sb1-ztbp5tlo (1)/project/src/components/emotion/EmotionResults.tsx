import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface EmotionData {
  dominantEmotion: string;
  emotions: {
    name: string;
    score: number;
    color: string;
  }[];
  depressionRisk: {
    level: 'low' | 'moderate' | 'high';
    score: number;
    factors: string[];
  };
  recommendations: string[];
}

interface EmotionResultsProps {
  data: EmotionData;
}

const EmotionResults: React.FC<EmotionResultsProps> = ({ data }) => {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'moderate':
        return 'text-amber-600 bg-amber-50';
      case 'high':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Dominant Emotion</h3>
        <div className="text-2xl font-bold text-blue-600">{data.dominantEmotion}</div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Emotion Breakdown</h3>
        <div className="space-y-3">
          {data.emotions.map((emotion) => (
            <div key={emotion.name} className="flex items-center">
              <div className="w-24 text-sm text-gray-600">{emotion.name}</div>
              <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full`}
                  style={{
                    width: `${emotion.score * 100}%`,
                    backgroundColor: emotion.color
                  }}
                ></div>
              </div>
              <div className="w-12 text-right text-sm text-gray-600 ml-2">
                {Math.round(emotion.score * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Depression Risk Assessment</h3>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${getRiskLevelColor(data.depressionRisk.level)}`}>
          {data.depressionRisk.level.charAt(0).toUpperCase() + data.depressionRisk.level.slice(1)} Risk
        </div>
        
        {data.depressionRisk.level !== 'low' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 text-sm">
                  This assessment suggests potential signs of depression. Consider discussing these results with a healthcare professional.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <h4 className="text-sm font-medium text-gray-700 mb-1">Contributing Factors:</h4>
        <ul className="list-disc pl-5 text-sm text-gray-600 mb-3">
          {data.depressionRisk.factors.map((factor, index) => (
            <li key={index}>{factor}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Recommendations</h3>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          {data.recommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmotionResults;

import React from 'react';
import type { AnalysisResult, DrugInteraction } from '../types';
import { Card } from './Card';

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const getSeverityClass = (severity: DrugInteraction['severity']) => {
  switch (severity) {
    case 'high':
      return 'border-red-500 bg-red-500/10 text-red-400';
    case 'moderate':
      return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
    case 'low':
      return 'border-green-500 bg-green-500/10 text-green-400';
    default:
      return 'border-gray-600 bg-gray-600/10 text-gray-400';
  }
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-secondary rounded w-1/3"></div>
    <div className="h-16 bg-secondary rounded w-full"></div>
    <div className="h-16 bg-secondary rounded w-full"></div>
  </div>
);


export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, isLoading, error }) => {
  if (isLoading) {
    return <Card><LoadingSkeleton /></Card>;
  }
  if (error) {
    return <Card><div className="text-red-400 bg-red-500/10 p-4 rounded-lg">{error}</div></Card>;
  }
  if (!result) {
    return (
      <Card>
        <div className="text-center text-muted-text py-10">
          <p className="text-5xl mb-2">🤖</p>
          <p>Your analysis results will appear here.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-xl font-bold text-white mb-4">🚨 Drug Interactions</h3>
        {result.interactions.length > 0 ? (
          <div className="space-y-3">
            {result.interactions.map((interaction, index) => (
              <div key={index} className={`p-3 border rounded-lg ${getSeverityClass(interaction.severity)}`}>
                <p className="font-bold">
                  {interaction.pair[0]} + {interaction.pair[1]} 
                  <span className="ml-2 capitalize text-sm font-medium">({interaction.severity})</span>
                </p>
                <p className="text-sm text-light-text/80">{interaction.explanation}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-muted-text">No interactions found.</p>}
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-white mb-4">💉 Dosage Recommendations</h3>
        {result.dosageRecommendations.length > 0 ? (
          <div className="space-y-3">
            {result.dosageRecommendations.map((dosage, index) => (
              <div key={index} className="bg-secondary p-3 rounded-lg">
                <p className="font-bold text-primary">{dosage.drug}</p>
                <p className="text-sm text-light-text/90">{dosage.recommendation}</p>
                {dosage.warning && <p className="text-xs text-yellow-400 mt-1">Warning: {dosage.warning}</p>}
              </div>
            ))}
          </div>
        ) : <p className="text-muted-text">No specific dosage recommendations generated.</p>}
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-white mb-4">🔄 Alternative Suggestions</h3>
        {result.alternativeSuggestions.length > 0 ? (
          <div className="space-y-3">
            {result.alternativeSuggestions.map((alt, index) => (
              <div key={index} className="bg-teal-500/10 border border-teal-500 p-3 rounded-lg">
                <p className="font-semibold text-teal-400">For: {alt.forDrug}</p>
                <p className="text-sm text-light-text/90">{alt.suggestion}</p>
                <p className="text-xs text-muted-text mt-1">Reason: {alt.reason}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-muted-text">No alternative medications suggested.</p>}
      </Card>
    </div>
  );
};

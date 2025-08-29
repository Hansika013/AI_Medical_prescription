
import React from 'react';
import { Card } from './Card';
import type { AnalysisResult } from '../types';

interface QuickInsightsProps {
  analysisResult: AnalysisResult | null;
}

const InsightBox: React.FC<{ label: string; value: string | number; icon: string }> = ({ label, value, icon }) => (
  <div className="flex-1 bg-gradient-to-br from-secondary to-dark-bg p-4 rounded-lg text-center flex flex-col items-center justify-center">
    <div className="text-2xl mb-1">{icon}</div>
    <div className="text-3xl font-extrabold text-white">{value}</div>
    <div className="text-sm text-muted-text">{label}</div>
  </div>
);

export const QuickInsights: React.FC<QuickInsightsProps> = ({ analysisResult }) => {
  const numDrugs = analysisResult?.drugs?.length ?? 0;
  const numInteractions = analysisResult?.interactions?.length ?? 0;
  const numHighRisk = analysisResult?.interactions?.filter(i => i.severity === 'high').length ?? 0;

  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-4">Quick Insights</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <InsightBox label="Drugs Detected" value={numDrugs} icon="💊" />
        <InsightBox label="Interactions" value={numInteractions} icon="🔄" />
        <InsightBox label="High Risk" value={numHighRisk} icon="🚨" />
      </div>
    </Card>
  );
};

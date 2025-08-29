
import React, { useState } from 'react';
import { Card } from './Card';
import { checkDrugInteractions } from '../services/geminiService';
import type { DrugInteraction } from '../types';

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
      <div className="h-16 bg-secondary rounded w-full"></div>
      <div className="h-16 bg-secondary rounded w-full"></div>
      <div className="h-16 bg-secondary rounded w-full"></div>
    </div>
);

export const InteractionChecker: React.FC = () => {
  const [drugList, setDrugList] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [interactions, setInteractions] = useState<DrugInteraction[] | null>(null);

  const handleCheckInteractions = async () => {
    if (!drugList.trim()) {
      setError("Please enter a list of drugs to check.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setInteractions(null);

    try {
      const result = await checkDrugInteractions(drugList);
      setInteractions(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDrugList('');
    setIsLoading(false);
    setError(null);
    setInteractions(null);
  }

  return (
    <main className="mt-6 flex flex-col gap-6">
      <Card>
        <h2 className="text-xl font-bold text-white mb-2">Drug Interaction Checker</h2>
        <p className="text-muted-text mb-4">Enter a comma-separated list of drugs to check for potential interactions.</p>
        <div>
          <label htmlFor="drugList" className="block text-sm font-medium text-muted-text mb-1">Drug List</label>
          <textarea
            id="drugList"
            value={drugList}
            onChange={(e) => setDrugList(e.target.value)}
            placeholder="e.g. Warfarin, Ibuprofen, Amoxicillin"
            className="w-full h-28 bg-dark-bg border border-secondary text-light-text rounded-lg p-2 resize-y focus:ring-2 focus:ring-primary focus:outline-none transition"
          />
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          <button onClick={handleCheckInteractions} disabled={isLoading} className="px-4 py-2 bg-gradient-to-r from-primary to-pink-700 text-white font-bold rounded-lg shadow-md hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Checking...' : 'Check Interactions'}
          </button>
          <button onClick={handleReset} disabled={isLoading} className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold rounded-lg shadow-md hover:scale-105 transition transform">
            Reset
          </button>
        </div>
      </Card>
      
      <Card>
        <h3 className="text-xl font-bold text-white mb-4">Interaction Results</h3>
        {isLoading && <LoadingSkeleton />}
        {error && <div className="text-red-400 bg-red-500/10 p-4 rounded-lg">{error}</div>}
        
        {!isLoading && !error && interactions !== null && (
          interactions.length > 0 ? (
            <div className="space-y-3">
              {interactions.map((interaction, index) => (
                <div key={index} className={`p-3 border rounded-lg ${getSeverityClass(interaction.severity)}`}>
                  <p className="font-bold">
                    {interaction.pair.join(' + ')}
                    <span className="ml-2 capitalize text-sm font-medium">({interaction.severity})</span>
                  </p>
                  <p className="text-sm text-light-text/80">{interaction.explanation}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-text">✅ No potential interactions were found among the specified drugs.</p>
          )
        )}
        
        {!isLoading && !error && interactions === null && (
          <p className="text-muted-text">Results will be displayed here.</p>
        )}
      </Card>
    </main>
  );
};

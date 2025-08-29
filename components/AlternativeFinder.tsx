import React, { useState } from 'react';
import { Card } from './Card';
import { findAlternativeMedication } from '../services/geminiService';
import type { AlternativeFinderResult } from '../types';

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
      <div className="space-y-2">
          <div className="h-6 bg-secondary rounded w-1/4"></div>
          <div className="h-4 bg-secondary rounded w-full"></div>
          <div className="h-4 bg-secondary rounded w-3/4"></div>
      </div>
      <div className="space-y-2">
          <div className="h-6 bg-secondary rounded w-1/4"></div>
          <div className="h-4 bg-secondary rounded w-full"></div>
          <div className="h-4 bg-secondary rounded w-3/4"></div>
      </div>
    </div>
);

const ResultCard: React.FC<{ result: AlternativeFinderResult }> = ({ result }) => (
    <div className="bg-secondary p-4 rounded-lg border border-primary/20">
        <h4 className="text-lg font-bold text-primary">{result.suggestedDrug}</h4>
        <div className="mt-3 space-y-2 text-sm">
            <div>
                <p className="font-semibold text-light-text">Reasoning:</p>
                <p className="text-muted-text">{result.reasoning}</p>
            </div>
            <div>
                <p className="font-semibold text-light-text">Benefits:</p>
                <p className="text-muted-text">{result.benefits}</p>
            </div>
            <div>
                <p className="font-semibold text-light-text">Considerations:</p>
                <p className="text-muted-text">{result.considerations}</p>
            </div>
        </div>
    </div>
);


export const AlternativeFinder: React.FC = () => {
    const [originalDrug, setOriginalDrug] = useState('');
    const [condition, setCondition] = useState('');
    const [patientContext, setPatientContext] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<AlternativeFinderResult[] | null>(null);

    const handleFindAlternatives = async () => {
        if (!originalDrug.trim() || !condition.trim()) {
            setError("Please enter the drug and the condition it's treating.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await findAlternativeMedication(originalDrug, condition, patientContext);
            setResults(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setOriginalDrug('');
        setCondition('');
        setPatientContext('');
        setIsLoading(false);
        setError(null);
        setResults(null);
    };

    return (
        <main className="mt-6 flex flex-col gap-6">
            <Card>
                <h2 className="text-xl font-bold text-white mb-2">Alternative Medication Finder</h2>
                <p className="text-muted-text mb-4">Find safer or more suitable drug alternatives based on patient context.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="originalDrug" className="block text-sm font-medium text-muted-text mb-1">Original Drug</label>
                        <input
                            id="originalDrug"
                            type="text"
                            value={originalDrug}
                            onChange={(e) => setOriginalDrug(e.target.value)}
                            placeholder="e.g., Ibuprofen"
                            className="w-full bg-dark-bg border border-secondary text-light-text rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="condition" className="block text-sm font-medium text-muted-text mb-1">Condition Being Treated</label>
                        <input
                            id="condition"
                            type="text"
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            placeholder="e.g., Headache"
                            className="w-full bg-dark-bg border border-secondary text-light-text rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none transition"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label htmlFor="patientContext" className="block text-sm font-medium text-muted-text mb-1">Patient Context (Optional)</label>
                    <textarea
                        id="patientContext"
                        value={patientContext}
                        onChange={(e) => setPatientContext(e.target.value)}
                        placeholder="e.g., Patient is also taking Warfarin and has a history of stomach ulcers."
                        className="w-full h-24 bg-dark-bg border border-secondary text-light-text rounded-lg p-2 resize-y focus:ring-2 focus:ring-primary focus:outline-none transition"
                    />
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                    <button onClick={handleFindAlternatives} disabled={isLoading} className="px-4 py-2 bg-gradient-to-r from-primary to-pink-700 text-white font-bold rounded-lg shadow-md hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? 'Searching...' : 'Find Alternatives'}
                    </button>
                    <button onClick={handleReset} disabled={isLoading} className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold rounded-lg shadow-md hover:scale-105 transition transform">
                        Reset
                    </button>
                </div>
            </Card>

            <Card>
                <h3 className="text-xl font-bold text-white mb-4">Suggested Alternatives</h3>
                {isLoading && <LoadingSkeleton />}
                {error && <div className="text-red-400 bg-red-500/10 p-4 rounded-lg">{error}</div>}
                
                {!isLoading && !error && results !== null && (
                    results.length > 0 ? (
                        <div className="space-y-4">
                            {results.map((res, index) => (
                                <ResultCard key={index} result={res} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-text">✅ No specific alternatives were suggested based on the provided context. The original drug may be appropriate, or more information may be needed.</p>
                    )
                )}

                {!isLoading && !error && results === null && (
                    <p className="text-muted-text">Suggestions will be displayed here.</p>
                )}
            </Card>
        </main>
    );
};

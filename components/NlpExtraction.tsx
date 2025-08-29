import React from 'react';
import type { Drug } from '../types';
import { Card } from './Card';

interface NlpExtractionProps {
  drugs: Drug[];
}

export const NlpExtraction: React.FC<NlpExtractionProps> = ({ drugs }) => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-2">🔎 Structured Information Extraction (NLP)</h2>
      <p className="text-muted-text mb-4 text-sm">Drug details automatically extracted from the prescription text.</p>
      {drugs.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-secondary">
          <table className="w-full text-left table-auto">
            <thead className="bg-secondary/50">
              <tr>
                <th className="p-3 text-sm font-semibold text-muted-text">Drug Name</th>
                <th className="p-3 text-sm font-semibold text-muted-text">Dosage</th>
                <th className="p-3 text-sm font-semibold text-muted-text">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {drugs.map((drug) => (
                <tr key={drug.name} className="border-t border-secondary">
                  <td className="p-3 font-semibold text-light-text">{drug.name}</td>
                  <td className="p-3 text-muted-text">{drug.dosage || 'N/A'}</td>
                  <td className="p-3 text-muted-text">{drug.frequency || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted-text">No medication details extracted yet. Run an analysis.</p>
      )}
    </Card>
  );
};
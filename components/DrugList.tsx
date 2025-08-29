
import React from 'react';
import type { Drug } from '../types';
import { Card } from './Card';

interface DrugListProps {
  drugs: Drug[];
}

export const DrugList: React.FC<DrugListProps> = ({ drugs }) => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-4">📚 Detailed Drug Information</h2>
      {drugs.length > 0 ? (
        <div className="space-y-4">
          {drugs.map((drug) => (
            <div key={drug.name} className="bg-secondary p-4 rounded-lg">
              <h4 className="text-lg font-bold text-primary">{drug.name}</h4>
              <p className="text-sm text-light-text/90 my-1">{drug.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {drug.classes.map((cls) => (
                  <span key={cls} className="text-xs bg-dark-bg text-muted-text px-2 py-1 rounded">
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-text">Detailed drug information will appear here after analysis.</p>
      )}
    </Card>
  );
};

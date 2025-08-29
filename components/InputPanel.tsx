
import React from 'react';
import { Card } from './Card';

interface InputPanelProps {
  age: string;
  setAge: (value: string) => void;
  weight: string;
  setWeight: (value:string) => void;
  prescription: string;
  setPrescription: (value: string) => void;
  onAnalyze: () => void;
  onSample: () => void;
  onReset: () => void;
  isLoading: boolean;
}

const InputField: React.FC<{ label: string; id: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; min?: string; max?: string; }> = ({ label, ...props }) => (
  <div className="flex-1 min-w-[120px]">
    <label htmlFor={props.id} className="block text-sm font-medium text-muted-text mb-1">{label}</label>
    <input {...props} className="w-full bg-dark-bg border border-secondary text-light-text rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none transition" />
  </div>
);

export const InputPanel: React.FC<InputPanelProps> = ({ age, setAge, weight, setWeight, prescription, setPrescription, onAnalyze, onSample, onReset, isLoading }) => {
  return (
    <Card>
      <div className="flex flex-wrap gap-4 mb-4">
        <InputField label="Patient Age (years)" id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} min="0" max="120" />
        <InputField label="Weight (kg)" id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Optional" min="0" />
      </div>
      <div>
        <label htmlFor="prescription" className="block text-sm font-medium text-muted-text mb-1">Prescription / Notes</label>
        <textarea
          id="prescription"
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
          placeholder="e.g. Take Paracetamol 500 mg every 6 hours. Patient is also on Warfarin."
          className="w-full h-36 bg-dark-bg border border-secondary text-light-text rounded-lg p-2 resize-y focus:ring-2 focus:ring-primary focus:outline-none transition"
        />
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        <button onClick={onAnalyze} disabled={isLoading} className="px-4 py-2 bg-gradient-to-r from-primary to-pink-700 text-white font-bold rounded-lg shadow-md hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? 'Analyzing...' : '🔍 Analyze'}
        </button>
        <button onClick={onSample} disabled={isLoading} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-lg shadow-md hover:scale-105 transition transform">
          ✨ Sample
        </button>
        <button onClick={onReset} disabled={isLoading} className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold rounded-lg shadow-md hover:scale-105 transition transform">
          Reset
        </button>
      </div>
    </Card>
  );
};

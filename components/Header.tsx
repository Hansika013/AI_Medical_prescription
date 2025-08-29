import React from 'react';

const Logo: React.FC = () => (
  <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-primary to-pink-700 rounded-xl shadow-lg transform -rotate-6">
    <svg width="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14 8H20L15 11L17 18L12 14L7 18L9 11L4 8H10L12 2Z" fill="white"/>
    </svg>
  </div>
);

type View = 'verifier' | 'interactionChecker' | 'alternativeFinder';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const buttonBaseClass = "px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex-grow text-center sm:flex-grow-0";
  const activeButtonClass = "bg-primary text-white shadow-lg";
  const inactiveButtonClass = "bg-secondary hover:bg-primary/50 text-muted-text";

  return (
    <header className="border-b border-secondary pb-4">
      <div className="flex items-center gap-4">
        <Logo />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">AI Medical Analysis Toolkit</h1>
          <p className="text-sm md:text-base text-muted-text">
            Verify prescriptions, check interactions, and find safer alternatives with AI.
          </p>
        </div>
      </div>
       <nav className="mt-6 flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => onViewChange('verifier')}
          className={`${buttonBaseClass} ${currentView === 'verifier' ? activeButtonClass : inactiveButtonClass}`}
          aria-current={currentView === 'verifier'}
        >
          Prescription Verifier
        </button>
        <button
          onClick={() => onViewChange('interactionChecker')}
          className={`${buttonBaseClass} ${currentView === 'interactionChecker' ? activeButtonClass : inactiveButtonClass}`}
          aria-current={currentView === 'interactionChecker'}
        >
          Interaction Checker
        </button>
        <button
          onClick={() => onViewChange('alternativeFinder')}
          className={`${buttonBaseClass} ${currentView === 'alternativeFinder' ? activeButtonClass : inactiveButtonClass}`}
          aria-current={currentView === 'alternativeFinder'}
        >
          Alternative Finder
        </button>
      </nav>
    </header>
  );
};

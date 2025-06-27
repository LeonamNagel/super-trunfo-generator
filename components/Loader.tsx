
import React from 'react';

interface LoaderProps {
  currentStep: string;
}

const Loader: React.FC<LoaderProps> = ({ currentStep }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <p className="text-slate-300 text-center">{currentStep || 'Processando...'}</p>
    </div>
  );
};

export default Loader;

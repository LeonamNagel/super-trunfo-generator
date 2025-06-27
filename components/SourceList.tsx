
import React, { useState } from 'react';
import { GroundingSource } from '../types';
import LinkIcon from './icons/LinkIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface SourceListProps {
  sources: GroundingSource[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-lg mx-auto mt-8 bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left p-6 hover:bg-slate-700/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-controls="source-list"
      >
        <div className="flex items-center">
          <LinkIcon className="w-5 h-5 mr-3 text-slate-400" />
          <h3 className="text-md font-bold text-slate-200">
            Fontes Utilizadas na Pesquisa
          </h3>
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 text-slate-400 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        id="source-list"
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="space-y-2 p-6 pt-0">
          {sources.map((source, index) => (
            <li key={index} className="truncate">
              <a
                href={source.web.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                title={source.web.title || source.web.uri}
              >
                {source.web.title || source.web.uri}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SourceList;

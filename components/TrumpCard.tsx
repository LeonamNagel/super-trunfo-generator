import React from 'react';
import { TrumpCardData, FormData } from '../types';
import BarChartIcon from './icons/BarChartIcon';

interface TrumpCardProps {
  cardData: TrumpCardData;
  imageDataUrl: string;
  userData: FormData;
}

const StatBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center space-x-3">
    <span className="text-sm font-semibold text-slate-300 w-24 capitalize">{label}</span>
    <div className="w-full bg-slate-600 rounded-full h-2.5">
      <div
        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
    <span className="text-sm font-bold text-white w-8 text-right">{value}</span>
  </div>
);

const TrumpCard: React.FC<TrumpCardProps> = ({ cardData, imageDataUrl, userData }) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-slate-800 rounded-2xl p-1.5 shadow-2xl bg-gradient-to-br from-slate-700 to-slate-900 animate-fade-in">
        <div className="bg-slate-800 rounded-xl overflow-hidden">
            <div className="relative">
                <img src={imageDataUrl} alt={`Retrato de ${userData.name}`} className="w-full h-80 object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h2 className="text-3xl font-black text-white uppercase tracking-wider">{userData.name}</h2>
                    <p className="text-lg font-bold text-cyan-300 tracking-tight italic">"{cardData.heroTitle}"</p>
                    <p className="text-md font-semibold text-slate-300 mt-1">{userData.company}</p>
                </div>
            </div>

            <div className="p-5 space-y-5">
                <div className="space-y-4">
                    <h3 className="flex items-center text-lg font-bold text-slate-200 border-b-2 border-slate-700 pb-2">
                        <BarChartIcon className="w-5 h-5 mr-2 text-blue-400"/>
                        Atributos
                    </h3>
                    <StatBar label="Experiência" value={cardData.stats.experiencia} />
                    <StatBar label="Inovação" value={cardData.stats.inovacao} />
                    <StatBar label="Liderança" value={cardData.stats.lideranca} />
                    <StatBar label="Técnica" value={cardData.stats.tecnica} />
                </div>
                
                <div className="text-sm text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <p className="italic">"{cardData.bio}"</p>
                    <p className="mt-3">
                        <span className="font-bold text-cyan-400">Poder Especial: </span>
                        <span>{cardData.poderEspecial}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TrumpCard;
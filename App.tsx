import React, { useState, useCallback } from 'react';
import UserInputForm from './components/UserInputForm';
import TrumpCard from './components/TrumpCard';
import Loader from './components/Loader';
import SourceList from './components/SourceList';
import { FormData, TrumpCardData, GroundingSource } from './types';
import * as geminiService from './services/geminiService';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', company: '', website: '' });
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [cardData, setCardData] = useState<TrumpCardData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company) return;

    setIsLoading(true);
    setError(null);
    setCardData(null);
    setImageUrl(null);
    setSources([]);

    try {
      setCurrentStep('Pesquisando seu perfil profissional na web...');
      const { summary, sources: foundSources } = await geminiService.searchProfessionalProfile(
        formData.name,
        formData.company,
        formData.website
      );
      setSources(foundSources);
      
      setCurrentStep('Analisando habilidades e criando seus atributos...');
      const data = await geminiService.createTrumpCardData(summary);
      setCardData(data);

      setCurrentStep('Gerando sua imagem de herói profissional...');
      const imageB64 = await geminiService.generateCardImage(
        formData.name,
        data.heroTitle,
        data.poderEspecial,
        data.gender,
        referenceImage || undefined
      );
      setImageUrl(`data:image/jpeg;base64,${imageB64}`);

    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
        setError(`Falha na Geração: ${errorMessage} Por favor, tente novamente.`);
        console.error(err);
    } finally {
      setIsLoading(false);
      setCurrentStep('');
    }
  }, [formData, referenceImage]);

  const resetApp = () => {
    setCardData(null);
    setImageUrl(null);
    setSources([]);
    setReferenceImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-blue-500/30">
      <main className="w-full flex flex-col items-center">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Gerador de Super Trunfo
          </h1>
          <p className="mt-2 text-lg text-slate-400 max-w-2xl mx-auto">
            Insira seus dados, nossa IA irá criar uma carta de Super Trunfo WK baseada em seu perfil profissional.
          </p>
        </div>

        {!cardData && !isLoading && (
            <UserInputForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                referenceImage={referenceImage}
                setReferenceImage={setReferenceImage}
            />
        )}

        {isLoading && <Loader currentStep={currentStep} />}
        
        {error && !isLoading && (
          <div className="text-center mt-8 p-4 bg-red-900/50 border border-red-700 rounded-lg max-w-lg">
            <p className="text-red-300 font-semibold">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsLoading(false);
              }}
              className="mt-4 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {cardData && imageUrl && !isLoading && (
          <div className="flex flex-col items-center w-full animate-fade-in">
            <TrumpCard cardData={cardData} imageDataUrl={imageUrl} userData={formData} />
            <SourceList sources={sources} />
            <button
              onClick={resetApp}
              className="mt-8 bg-[#a71c7b] hover:bg-[#d63d2a] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 ease-in-out transform hover:scale-105"
            >
              Criar Outro Card
            </button>
          </div>
        )}

      </main>
      <footer className="text-center text-slate-500 text-sm mt-12 pb-4">
        <p>Powered by Straas Tech</p>
      </footer>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.7s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
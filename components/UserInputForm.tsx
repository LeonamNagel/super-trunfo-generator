import React, { useState, useRef } from 'react';
import { FormData } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import CameraIcon from './icons/CameraIcon';
import UploadIcon from './icons/UploadIcon';
import TrashIcon from './icons/TrashIcon';
import CameraCapture from './CameraCapture';

interface UserInputFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  referenceImage: string | null;
  setReferenceImage: (image: string | null) => void;
}

const UserInputForm: React.FC<UserInputFormProps> = ({ 
  formData, 
  setFormData, 
  handleSubmit, 
  isLoading,
  referenceImage,
  setReferenceImage 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setReferenceImage(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWebsiteBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let { value } = e.target;
    if (value && !/^https?:\/\//i.test(value)) {
      value = `https://${value}`;
      setFormData(prev => ({ ...prev, website: value }));
    }
  };

  const isFormValid = formData.name.trim() !== '' && formData.company.trim() !== '';

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-800/50 p-8 rounded-2xl shadow-2xl border border-slate-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Nome Completo</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Ada Lovelace"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">Empresa Atual ou Principal</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Ex: Babbage & Lovelace Inc."
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-slate-300 mb-2">Site Pessoal ou LinkedIn (Opcional)</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            onBlur={handleWebsiteBlur}
            placeholder="www.linkedin.com/in/..."
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Foto de Referência (Opcional)</label>
            <div className={`mt-1 flex justify-center items-center p-4 border-2 border-slate-600 border-dashed rounded-md ${!referenceImage && 'min-h-[140px]'}`}>
                {referenceImage ? (
                <div className="relative group">
                    <img src={referenceImage} alt="Pré-visualização" className="h-40 w-auto rounded-lg mx-auto" />
                    <button
                    type="button"
                    onClick={() => setReferenceImage(null)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Remover imagem"
                    >
                    <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
                ) : (
                <div className="space-y-1 text-center">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center gap-2 relative cursor-pointer bg-slate-700/50 hover:bg-slate-700 rounded-md font-medium text-blue-300 hover:text-blue-200 transition-colors p-4 w-32"
                        >
                            <UploadIcon className="w-8 h-8"/>
                            <span>Carregar Foto</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowCamera(true)}
                            className="flex flex-col items-center justify-center gap-2 relative cursor-pointer bg-slate-700/50 hover:bg-slate-700 rounded-md font-medium text-blue-300 hover:text-blue-200 transition-colors p-4 w-32"
                        >
                            <CameraIcon className="w-8 h-8"/>
                            <span>Tirar Foto</span>
                        </button>
                    </div>
                    <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleFileChange} />
                </div>
                )}
            </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full flex items-center justify-center bg-[#a71c7b] hover:bg-[#d63d2a] disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Gerando Magia...' : 'Criar Meu Super Trunfo'}
        </button>
      </form>
      {showCamera && (
        <CameraCapture
            onCapture={(dataUrl) => {
            setReferenceImage(dataUrl);
            setShowCamera(false);
            }}
            onClose={() => setShowCamera(false)}
        />
        )}
    </div>
  );
};

export default UserInputForm;
export interface TrumpCardStats {
  experiencia: number;
  inovacao: number;
  lideranca: number;
  tecnica: number;
}

export interface TrumpCardData {
  stats: TrumpCardStats;
  bio: string;
  poderEspecial: string;
  heroTitle: string;
  gender: 'male' | 'female' | 'neutral';
}

export interface FormData {
  name: string;
  company: string;
  website: string;
}

export interface GroundingSource {
  web: {
    uri: string;
    title: string;
  };
}
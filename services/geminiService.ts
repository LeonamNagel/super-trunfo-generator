import { GoogleGenAI, GenerateContentResponse, Part, Modality } from "@google/genai";
import { TrumpCardData, GroundingSource } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonFromText = <T,>(text: string): T => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse JSON response:", e);
    throw new Error("Resposta da IA em formato JSON inválido.");
  }
};

export const describeImage = async (imageDataUrl: string): Promise<string> => {
  const parts = imageDataUrl.split(',');
  const mimeType = parts[0].match(/:(.*?);/)?.[1];
  const base64Data = parts[1];

  if (!mimeType || !base64Data) {
    throw new Error("Formato de imagem inválido.");
  }

  const imagePart: Part = {
    inlineData: {
      mimeType: mimeType,
      data: base64Data,
    },
  };

  const textPart: Part = {
    text: "Descreva em detalhes as características faciais da pessoa nesta imagem (formato do rosto, tipo de cabelo e cor, formato dos olhos, nariz, boca e quaisquer características marcantes como barba, óculos, etc). Seja objetivo e foque nos traços visuais para que um artista possa recriar o rosto. Responda com uma única frase concisa.",
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
    });
    return response.text ?? "";
  } catch (error) {
    console.error("Error describing image:", error);
    throw new Error("Falha ao analisar a imagem de referência.");
  }
};

export const searchProfessionalProfile = async (name: string, company: string, website: string): Promise<{ summary: string; sources: GroundingSource[] }> => {
  let prompt = `Faça uma pesquisa aprofundada na web e resuma o perfil profissional de ${name}, que trabalha/trabalhou na ${company}.`;

  if (website) {
    prompt += ` Utilize o site/perfil (${website}) como a principal fonte de referência e informação.`;
  }

  prompt += ` Foque em suas habilidades técnicas, marcos de carreira, projetos notáveis e estilo de liderança. O objetivo é coletar informações para criar um card de "Super Trunfo" sobre suas competências profissionais.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const summary = response.text ?? "";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingSource[] = groundingMetadata?.groundingChunks?.filter(
        (chunk): chunk is GroundingSource => chunk?.web?.uri !== undefined && chunk.web.uri !== ''
    ) || [];
    
    return { summary, sources };
  } catch (error) {
    console.error("Error searching professional profile:", error);
    throw new Error("Falha ao pesquisar o perfil profissional.");
  }
};

export const createTrumpCardData = async (profileSummary: string): Promise<TrumpCardData> => {
  const prompt = `Analise o seguinte perfil profissional e crie os dados para uma carta de "Super Trunfo". As estatísticas devem ser de 0 a 100. As categorias são: "experiencia", "inovacao", "lideranca" e "tecnica". 

Crie também:
- Uma breve biografia (máximo 3 frases)
- Um "poderEspecial" criativo e impactante
- Um "heroTitle" (título de super-herói) INSPIRADO na cultura tech/nerd baseado no perfil

Para o heroTitle, seja criativo mas elegante, inspirado em:
- Tech/Desenvolvimento (ex: "O Arquiteto de Sistemas", "A Mestra dos Algoritmos", "O Guardian do Código")
- Liderança Digital (ex: "O Estrategista Tech", "A Visionária Digital", "O Mentor de Inovação")
- Especialidades (ex: "O Senhor dos Dados", "A Especialista em Cloud", "O Mago do Frontend")
- Sci-fi Elegante (ex: "O Navegador Digital", "A Pioneira Cyber", "O Arquiteto do Futuro")

O título deve ser INSPIRADOR e PROFISSIONAL, mas com toque nerd elegante. Evite exageros.

Identifique também o gênero da pessoa como 'male', 'female', ou 'neutral' se não for claro.

Responda APENAS em formato JSON com a seguinte estrutura:
{
  "stats": {
    "experiencia": number,
    "inovacao": number,
    "lideranca": number,
    "tecnica": number
  },
  "bio": string,
  "poderEspecial": string,
  "heroTitle": string,
  "gender": "male" | "female" | "neutral"
}

Perfil para análise:
---
${profileSummary}
---
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      throw new Error("A resposta da IA não contém texto.");
    }
    return parseJsonFromText<TrumpCardData>(response.text);
  } catch (error) {
    console.error("Error creating trump card data:", error);
    throw new Error("Falha ao criar os dados da carta.");
  }
};

export const generateCardImage = async (
    name: string, 
    heroTitle: string, 
    specialPower: string, 
    gender: string,
    referenceImage?: string // Base64 da imagem de referência
): Promise<string> => {
  
  let genderTerm = "um(a) profissional";
  let genderSpecifics = "A pessoa pode ser do gênero masculino ou feminino."
  if (gender === 'male') {
      genderTerm = "um profissional homem";
      genderSpecifics = "O retrato deve ser de um homem."
  } else if (gender === 'female') {
      genderTerm = "uma profissional mulher";
      genderSpecifics = "O retrato deve ser de uma mulher."
  }
  
  let prompt = `Crie um retrato profissional e heroico para ${genderTerm} de tecnologia, estilo "digital art" cinematográfico inspirado em super-heróis modernos. ${genderSpecifics} O nome do herói é ${name} e seu título heroico é "${heroTitle}". 

A imagem deve refletir tanto o título quanto o poder especial: "${specialPower}". 

FORMATO: A imagem deve ser QUADRADA (1:1, formato square) para caber perfeitamente no layout da carta.

ESTILO VISUAL: Inspirado em arte conceitual de filmes como Marvel/DC, com toque de elegância tech:
- Paleta de cores sofisticada e impactante
- Iluminação cinematográfica profissional
- Pose confiante e inspiradora (busto/meio corpo)
- Fundo tecnológico moderno e elegante
- Efeitos visuais sutis mas impactantes
- Estilo realista com qualidade profissional
- FORMATO QUADRADO (1:1 aspect ratio)

O resultado deve ser INSPIRADOR e PROFISSIONAL, como um retrato corporativo futurista de alta qualidade.`;
  
  if (referenceImage) {
    prompt += `\n\nIMPORTANTE: Use a imagem fornecida como referência para as características físicas e faciais da pessoa, transformando-a em um super-herói mantendo a semelhança.`;
  }
  
  try {
    // Preparar as parts do conteúdo
    const parts: any[] = [
      {
        text: prompt,
      }
    ];

    // Se houver imagem de referência, processar e adicionar aos parts
    if (referenceImage) {
      // Remover o prefixo data URL se existir
      let imageData = referenceImage;
      let mimeType = 'image/jpeg'; // Default
      
      if (referenceImage.startsWith('data:')) {
        const [header, data] = referenceImage.split(',');
        imageData = data;
        
        // Extrair o tipo MIME do header
        const mimeMatch = header.match(/data:([^;]+)/);
        if (mimeMatch) {
          mimeType = mimeMatch[1];
        }
      }

      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: imageData,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: [
        {
          role: 'user',
          parts: parts,
        },
      ],
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
        responseMimeType: 'text/plain',
      },
    });

    // Procurar pela parte que contém os dados da imagem
    const candidates = response.candidates;
    if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
    
    // Se não encontrou imagem, lançar erro
    throw new Error("Nenhuma imagem foi gerada pela API.");
    
  } catch (error) {
    console.error("Error generating card image:", error);
    throw new Error("Falha ao gerar a imagem da carta.");
  }
};
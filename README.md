# Gerador de Cartas Super Trunfo com IA

Este projeto é um gerador de cartas Super Trunfo que utiliza inteligência artificial (Google Gemini) para criar cartas personalizadas baseadas em temas e descrições fornecidas pelo usuário.

## 🚀 Funcionalidades

- Geração automática de cartas Super Trunfo com IA
- Interface amigável e intuitiva
- Suporte a captura de imagem via câmera
- Upload de imagens personalizadas
- Múltiplas categorias e atributos

## 🛠️ Tecnologias Utilizadas

- **React** - Biblioteca para interface de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e dev server
- **Google Gemini API** - Inteligência artificial para geração de conteúdo

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- NPM ou Yarn
- Chave API do Google Gemini

## 🔧 Instalação e Execução

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
   cd NOME_DO_REPOSITORIO
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure a chave da API:**

   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione sua chave do Gemini API:

   ```
   GEMINI_API_KEY=sua_chave_api_aqui
   ```

4. **Execute o projeto:**

   ```bash
   npm run dev
   ```

5. **Acesse o aplicativo:**
   Abra seu navegador e acesse `http://localhost:5173`

## 📁 Estrutura do Projeto

```
gerador/
├── components/          # Componentes React
│   ├── icons/          # Ícones customizados
│   ├── CameraCapture.tsx
│   ├── Loader.tsx
│   ├── SourceList.tsx
│   ├── TrumpCard.tsx
│   └── UserInputForm.tsx
├── services/           # Serviços e APIs
│   └── geminiService.ts
├── App.tsx            # Componente principal
├── types.ts           # Definições de tipos TypeScript
└── ...
```

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

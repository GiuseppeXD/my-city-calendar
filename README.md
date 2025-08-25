# Calculadora de Dias Úteis

Brazilian work day calculator with AI-enhanced holiday detection for accurate planning across Brazilian cities.

## Features

🗓️ **Visual Calendar** - Color-coded calendar with work days, weekends, and holidays  
🤖 **AI-Enhanced Holidays** - Real-time holiday discovery using Gemini AI  
📊 **Work Day Statistics** - Calculate total work days and hours  
🏙️ **Multi-City Support** - Salvador, Rio de Janeiro, São Paulo, and Brazil Federal  
🌐 **Real-Time Data** - Federal holidays from official BrasilAPI  

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <YOUR_GIT_URL>
   cd my-city-calendar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional):**
   ```bash
   cp .env.example .env
   # Edit .env and add your Gemini API key (see AI Setup section below)
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Visit `http://localhost:5173` to see the application running.

## AI Holiday Enhancement Setup

This application can use Google's Gemini AI to discover additional municipal holidays and facultative days that might not be in the hardcoded database.

### 🤖 **Enable AI Holiday Discovery**

1. **Get a Free Gemini API Key:**
   - Visit [Google AI Studio](https://ai.google.dev/)
   - Sign in with your Google account
   - Click "Get API Key" and create a new key
   - Copy your API key

2. **Configure Environment Variables:**
   ```bash
   # Create environment file
   cp .env.example .env
   
   # Edit .env and add your API key
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. **Restart Development Server:**
   ```bash
   npm run dev
   ```

### 🎯 **How AI Enhancement Works**

- **Without AI**: Shows federal holidays (BrasilAPI) + verified municipal holidays
- **With AI**: Adds AI-discovered holidays like facultative days, regional celebrations, etc.
- **Fallback**: If AI fails, falls back to verified holiday data
- **Caching**: AI responses are cached to minimize API calls

### 🏙️ **Supported Cities with AI Enhancement**

- **Salvador, Bahia** - Municipal holidays + Bahia state holidays
- **Rio de Janeiro, RJ** - Municipal holidays + RJ state holidays  
- **São Paulo, SP** - Municipal holidays + SP state holidays
- **Brazil Federal** - National holidays only (no AI enhancement needed)

### 🔧 **Debugging AI Holidays**

Open browser console to see AI enhancement logs:
```
[AI Enhancement] Enhancing holidays for salvador (Bahia) in 2024
[AI Cache] Cache miss for salvador-bahia-brazil-2024, fetching from AI...
[AI Enhancement] Got 3 AI holidays
[AI Enhancement] Adding 1 new holidays from AI
```

## What technologies are used for this project?

This project is built with:

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS with custom calendar theme
- **APIs**: BrasilAPI (federal holidays) + Google Gemini AI (municipal holidays)
- **State Management**: React hooks with intelligent caching
- **Date Handling**: date-fns with Brazilian Portuguese locale

## Deployment

This project can be deployed to various platforms. Here are the most popular options:

### 🚀 **Vercel (Recommended)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. **One-click deployment:**
   - Click the "Deploy with Vercel" button above
   - Connect your GitHub account
   - Configure environment variables (if using AI features)

2. **Manual deployment:**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

3. **Environment Variables:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add: `VITE_GEMINI_API_KEY=your_api_key_here`

### 🔥 **Netlify**

1. **Build and deploy:**
   ```bash
   npm run build
   npx netlify-cli deploy --prod --dir=dist
   ```

2. **From GitHub:**
   - Connect your GitHub repo to Netlify
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables: Add `VITE_GEMINI_API_KEY` in Site settings

### 📄 **GitHub Pages**

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/my-city-calendar",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### ☁️ **Other Platforms**

- **Railway**: `railway login && railway up`
- **Firebase Hosting**: `firebase deploy`
- **Render**: Connect GitHub repo with build command `npm run build`
- **Surge**: `npm install -g surge && surge dist/`

### 🔧 **Build Configuration**

For production builds:
```bash
npm run build
```

The built files will be in the `dist/` directory.

### 🌍 **Environment Variables**

For platforms that support environment variables, add:
- `VITE_GEMINI_API_KEY`: Your Google Gemini API key (optional)

**Note**: All `VITE_` prefixed variables are exposed to the client-side code.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the console for debugging information
- Ensure your Gemini API key is properly configured for AI features

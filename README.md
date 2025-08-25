# Calculadora de Dias Úteis

Brazilian work day calculator with AI-enhanced holiday detection for accurate planning across Brazilian cities.

## Features

🗓️ **Visual Calendar** - Color-coded calendar with work days, weekends, and holidays  
🤖 **AI-Enhanced Holidays** - Real-time holiday discovery using Gemini AI  
📊 **Work Day Statistics** - Calculate total work days and hours  
🏙️ **Multi-City Support** - Salvador, Rio de Janeiro, São Paulo, and Brazil Federal  
🌐 **Real-Time Data** - Federal holidays from official BrasilAPI  

## Project info

**URL**: https://lovable.dev/projects/00909ef8-158c-451a-a901-3e1a3a13980c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/00909ef8-158c-451a-a901-3e1a3a13980c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up AI holiday enhancement (optional)
cp .env.example .env
# Edit .env and add your Gemini API key (see AI Setup section below)

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

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

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/00909ef8-158c-451a-a901-3e1a3a13980c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

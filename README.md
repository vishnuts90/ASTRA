# ASTRA - Audio-to-Text Real-Time Application

![ASTRA Logo](https://img.shields.io/badge/ASTRA-Audio%20to%20Text-blue?style=for-the-badge&logo=mic)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

ASTRA is a modern web application that converts audio files (live or uploaded) into text with advanced multilingual capabilities using **Google's Gemini AI**. The app features manual transcription control, intelligent language detection, dual transcription options, and comprehensive user data management.

## ✨ Features

### 🎤 Core Functionality
- **Live Audio Recording**: Record audio directly from your microphone with real-time level monitoring
- **File Upload**: Support for MP3, WAV, OGG, M4A, FLAC formats (up to 100MB)
- **Manual Transcription Control**: Transcription starts only when you click "Transcribe"
- **Audio Preview**: Pre-transcription audio preview with playback controls

### 🌍 Intelligent Language Processing
- **Automatic Language Detection**: Supports 50+ languages including English, Spanish, French, German, Hindi, Malayalam, Tamil, Telugu, Arabic, Chinese, Japanese, and more
- **Dual Transcription**: Original language transcription + optional translation
- **Language Confidence Score**: Display confidence levels for detected languages
- **Smart Translation**: High-accuracy translation to user-selected target language

### 📝 Enhanced Text Output
- **Dual Display**: Show both original and translated transcriptions
- **Text Editing**: Edit and correct transcriptions
- **Export Options**: Export as TXT, DOCX, or PDF
- **Copy to Clipboard**: One-click copying functionality
- **Text Formatting**: Adjustable font sizes and highlighting

### 🎨 Modern Design
- **Vibrant Color Scheme**: Electric Blue (#007BFF), Vibrant Teal (#20C997), Warm Orange (#FF6B35)
- **Responsive Design**: Works perfectly on all devices
- **Smooth Animations**: Framer Motion powered transitions
- **Glass Morphism**: Modern UI with backdrop blur effects

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini AI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/astra.git
   cd astra
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Gemini AI API Key (Required for transcription)
   # Get your API key from: https://makersuite.google.com/app/apikey
   GOOGLE_API_KEY=your_gemini_api_key_here
   
   # Google OAuth Credentials (Required for authentication)
   # Get these from: https://console.cloud.google.com/apis/credentials
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Setting Up Gemini AI

1. **Get API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Create API Key**: Click "Create API Key" and copy the key
3. **Add to Environment**: Paste the key in your `.env.local` file
4. **Restart Server**: Restart the development server after adding the key

## 🔐 Setting Up Google OAuth

1. **Create Google Cloud Project**: Visit [Google Cloud Console](https://console.cloud.google.com/)
2. **Enable Google+ API**: Go to APIs & Services > Library > Search for "Google+ API" and enable it
3. **Create OAuth Credentials**: 
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
4. **Copy Credentials**: Copy the Client ID and Client Secret
5. **Add to Environment**: Add them to your `.env.local` file
6. **Generate NextAuth Secret**: Run `openssl rand -base64 32` to generate a secret
7. **Restart Server**: Restart the development server

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Zustand**: Lightweight state management
- **React Dropzone**: Drag-and-drop file uploads
- **React Hot Toast**: Beautiful notifications

### AI & Backend
- **Google Gemini AI**: Advanced audio transcription and translation
- **Next.js API Routes**: Server-side API endpoints
- **FormData API**: File upload handling

### UI Components
- **Heroicons**: Beautiful SVG icons
- **Headless UI**: Accessible UI components
- **Lucide React**: Additional icon set

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📁 Project Structure

```
astra/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── transcribe/    # Transcription API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AudioRecorder.tsx  # Live recording component
│   ├── FileUpload.tsx     # File upload component
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Footer component
│   ├── LanguageSelector.tsx # Language selection
│   └── TranscriptionDisplay.tsx # Results display
├── lib/                   # Utility libraries
│   └── geminiService.ts   # Gemini AI service
├── store/                 # State management
│   └── useAppStore.ts     # Zustand store
├── types/                 # TypeScript types
│   └── index.ts           # Type definitions
├── public/                # Static assets
└── package.json           # Dependencies
```

## 🎯 Key Features Implementation

### AI-Powered Transcription
- **Google Gemini AI Integration**: Real-time audio transcription
- **Multilingual Support**: 50+ languages with automatic detection
- **Translation Capabilities**: High-accuracy translation
- **Error Handling**: Graceful fallback to sample data

### Audio Recording
- Real-time audio level monitoring
- Pause/resume functionality
- Audio format conversion
- Error handling for permissions

### File Upload
- Drag-and-drop interface
- File validation (type and size)
- Progress indicators
- Audio preview with controls

### Language Processing
- 50+ supported languages
- Automatic language detection
- Manual language selection
- Translation capabilities

### User Experience
- Responsive design
- Loading states
- Error handling
- Toast notifications
- Smooth animations

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Add environment variables in Netlify dashboard

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [Heroicons](https://heroicons.com/) for beautiful icons
- [Google Gemini AI](https://ai.google.dev/) for advanced AI capabilities

## 📞 Support

- 📧 Email: support@astra-app.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/astra/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/astra/wiki)

---

Made with ❤️ by the ASTRA Team

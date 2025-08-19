# 🚀 ASTRA Deployment Guide - Netlify

This guide will help you deploy your ASTRA application to Netlify with full AI transcription functionality.

## 📋 Prerequisites

- ✅ ASTRA application working locally
- ✅ Google Gemini AI API key
- ✅ Netlify account (free)
- ✅ GitHub account (for repository)

## 🎯 Deployment Steps

### Step 1: Prepare Your Repository

1. **Create a GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial ASTRA commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/astra-app.git
   git push -u origin main
   ```

### Step 2: Configure Environment Variables

1. **Go to Netlify Dashboard**
   - Visit [netlify.com](https://netlify.com)
   - Sign in or create account

2. **Create New Site**
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the repository

3. **Set Build Settings**
   ```
   Build command: npm run build
   Publish directory: out
   Node version: 18
   ```

4. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add: `NEXT_PUBLIC_GEMINI_API_KEY`
   - Value: `AIzaSyAaeBf6PeD8foNPTmeyFO1QpB8SiAJ-6Q0`

### Step 3: Deploy

1. **Trigger Deployment**
   - Netlify will automatically build and deploy
   - Monitor the build logs for any errors

2. **Verify Deployment**
   - Check your live site URL
   - Test audio recording and transcription

## 🔧 Configuration Files

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

## 🌐 Netlify Functions

The application uses Netlify Functions for serverless API calls:

- **Location**: `netlify/functions/api/transcribe.js`
- **Endpoint**: `/.netlify/functions/api/transcribe`
- **Function**: Handles audio transcription with Gemini AI

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini AI API key | ✅ Yes |

## 🚨 Troubleshooting

### Build Errors
1. **Node Version**: Ensure Node.js 18+ is used
2. **Dependencies**: Run `npm install` locally first
3. **API Key**: Verify environment variable is set correctly

### Function Errors
1. **CORS**: Functions include CORS headers
2. **Timeout**: Functions have 10-second timeout
3. **Memory**: Functions have 1024MB memory limit

### Common Issues
1. **404 Errors**: Check redirects in `netlify.toml`
2. **API Failures**: Verify API key and function deployment
3. **Audio Issues**: Check browser permissions

## 📊 Performance Optimization

1. **Static Export**: All pages are pre-built
2. **CDN**: Netlify provides global CDN
3. **Caching**: Static assets are cached automatically
4. **Functions**: Serverless for dynamic content

## 🔒 Security

1. **API Key**: Stored securely in environment variables
2. **CORS**: Properly configured for cross-origin requests
3. **Headers**: Security headers included in `netlify.toml`

## 📱 PWA Features

- ✅ Offline support
- ✅ Install prompt
- ✅ Service worker
- ✅ Responsive design

## 🎉 Success Checklist

- [ ] Repository pushed to GitHub
- [ ] Netlify site created
- [ ] Environment variables set
- [ ] Build successful
- [ ] Site accessible
- [ ] Audio recording works
- [ ] Transcription functional
- [ ] Export features working

## 🆘 Support

If you encounter issues:

1. Check Netlify build logs
2. Verify environment variables
3. Test locally first
4. Check browser console for errors
5. Review function logs in Netlify dashboard

## 🌟 Features After Deployment

- ✅ **Live Audio Recording** with real-time monitoring
- ✅ **File Upload** (MP3, WAV, OGG, M4A, FLAC)
- ✅ **AI Transcription** using Google Gemini
- ✅ **50+ Languages** support
- ✅ **Smart Translation** with confidence scoring
- ✅ **Export Options** (TXT, DOCX, PDF)
- ✅ **Responsive Design** for all devices
- ✅ **PWA Features** for mobile experience

Your ASTRA application will be live and fully functional! 🚀

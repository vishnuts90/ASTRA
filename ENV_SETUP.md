# Environment Variables Setup Guide

## 🔐 Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Google Gemini AI API Key (Required for transcription)
# Get your API key from: https://makersuite.google.com/app/apikey
GOOGLE_API_KEY=your_gemini_api_key_here

# Google OAuth Credentials (Required for authentication)
# Get these from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=ZS3l/Nm7jqEkhtf6uS9XdDjX3nbJa9xzxrjHppfIeTM=
```

## 🔧 How to Get Google OAuth Credentials

### Step 1: Create Google Cloud Project
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one

### Step 2: Enable Google+ API
1. Go to **APIs & Services** > **Library**
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" if prompted

### Step 3: Create OAuth Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **"Create Credentials"** > **"OAuth 2.0 Client IDs"**
3. Choose **"Web application"**
4. Add these **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Click **"Create"**
6. Copy the **Client ID** and **Client Secret**

### Step 4: Add to Environment
Replace `your_google_client_id_here` and `your_google_client_secret_here` with your actual credentials.

## 🚀 After Setup
1. Save the `.env.local` file
2. Restart your development server: `npm run dev`
3. Test Google OAuth by clicking "Continue with Google"

## ⚠️ Important Notes
- Never commit `.env.local` to version control
- The `NEXTAUTH_SECRET` provided is unique for your project
- For production, generate a new secret and update `NEXTAUTH_URL`

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

class GeminiTranscriptionService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async transcribeAudio(audioBlob, originalLanguage, targetLanguage) {
    const startTime = Date.now();
    
    try {
      // Convert audio blob to base64
      const base64Audio = await this.blobToBase64(audioBlob);
      
      // Create the prompt for transcription
      const prompt = this.createTranscriptionPrompt(originalLanguage, targetLanguage);
      
      // Generate content with audio
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: this.getMimeType(audioBlob),
            data: base64Audio
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      
      // Parse the response
      const transcription = this.parseTranscriptionResponse(text, targetLanguage);
      
      const processingTime = Date.now() - startTime;
      
      return {
        originalText: transcription.originalText,
        translatedText: transcription.translatedText,
        detectedLanguage: transcription.detectedLanguage,
        confidence: transcription.confidence,
        processingTime
      };
      
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio. Please try again.');
    }
  }

  async blobToBase64(blob) {
    // Convert Blob to ArrayBuffer first
    const arrayBuffer = await blob.arrayBuffer();
    
    // Convert ArrayBuffer to base64
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    // Convert to base64
    return btoa(binary);
  }

  getMimeType(blob) {
    // Map file extensions to MIME types
    const mimeTypes = {
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'm4a': 'audio/mp4',
      'flac': 'audio/flac'
    };
    
    // Try to get MIME type from blob
    if (blob.type) {
      return blob.type;
    }
    
    // Fallback based on file extension
    const fileName = blob.name || '';
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    return mimeTypes[extension || ''] || 'audio/wav';
  }

  createTranscriptionPrompt(originalLanguage, targetLanguage) {
    let prompt = `Please transcribe the audio content accurately. `;
    
    if (originalLanguage && originalLanguage !== 'auto') {
      prompt += `The audio is in ${originalLanguage}. `;
    } else {
      prompt += `Please detect the language automatically. `;
    }
    
    prompt += `Provide the transcription in the original language with high accuracy. `;
    
    if (targetLanguage && targetLanguage !== originalLanguage) {
      prompt += `Also provide a translation to ${targetLanguage}. `;
    }
    
    prompt += `\n\nPlease format your response as follows:
    Original Text: [transcription in original language]
    Detected Language: [detected language]
    Confidence: [confidence level as percentage]
    ${targetLanguage && targetLanguage !== originalLanguage ? `Translation: [translation to ${targetLanguage}]` : ''}`;
    
    return prompt;
  }

  parseTranscriptionResponse(text, targetLanguage) {
    // Parse the response text to extract structured data
    const lines = text.split('\n');
    let originalText = '';
    let translatedText = '';
    let detectedLanguage = 'Unknown';
    let confidence = 0.85; // Default confidence

    for (const line of lines) {
      if (line.startsWith('Original Text:')) {
        originalText = line.replace('Original Text:', '').trim();
      } else if (line.startsWith('Translation:')) {
        translatedText = line.replace('Translation:', '').trim();
      } else if (line.startsWith('Detected Language:')) {
        detectedLanguage = line.replace('Detected Language:', '').trim();
      } else if (line.startsWith('Confidence:')) {
        const confStr = line.replace('Confidence:', '').trim();
        const confMatch = confStr.match(/(\d+(?:\.\d+)?)/);
        if (confMatch) {
          confidence = parseFloat(confMatch[1]) / 100;
        }
      }
    }

    // If no structured response, treat the entire text as original transcription
    if (!originalText && text.trim()) {
      originalText = text.trim();
    }

    return {
      originalText,
      translatedText: translatedText || undefined,
      detectedLanguage,
      confidence
    };
  }
}

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const body = JSON.parse(event.body);
    const { audio, originalLanguage, targetLanguage } = body;

    if (!audio) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No audio data provided' })
      };
    }

    // Convert base64 audio back to blob
    const audioBlob = {
      type: audio.type || 'audio/wav',
      name: audio.name || 'audio.wav',
      arrayBuffer: async () => {
        const binaryString = atob(audio.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      }
    };

    // Initialize transcription service
    const geminiService = new GeminiTranscriptionService();

    // Perform transcription
    const result = await geminiService.transcribeAudio(
      audioBlob,
      originalLanguage,
      targetLanguage
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result
      })
    };

  } catch (error) {
    console.error('Transcription API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to transcribe audio',
        details: error.message
      })
    };
  }
};

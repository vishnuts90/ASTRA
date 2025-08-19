import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface TranscriptionRequest {
  audioBlob: Blob;
  originalLanguage?: string;
  targetLanguage?: string;
}

export interface TranscriptionResponse {
  originalText: string;
  translatedText?: string;
  detectedLanguage: string;
  confidence: number;
  processingTime: number;
}

export class GeminiTranscriptionService {
  private static instance: GeminiTranscriptionService;
  private model: any;

  private constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  public static getInstance(): GeminiTranscriptionService {
    if (!GeminiTranscriptionService.instance) {
      GeminiTranscriptionService.instance = new GeminiTranscriptionService();
    }
    return GeminiTranscriptionService.instance;
  }

  async transcribeAudio(request: TranscriptionRequest): Promise<TranscriptionResponse> {
    const startTime = Date.now();
    
    try {
      // Convert audio blob to base64
      const base64Audio = await this.blobToBase64(request.audioBlob);
      
      // Create the prompt for transcription
      const prompt = this.createTranscriptionPrompt(request.originalLanguage, request.targetLanguage);
      
      // Generate content with audio
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: this.getMimeType(request.audioBlob),
            data: base64Audio
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      
      // Parse the response
      const transcription = this.parseTranscriptionResponse(text, request.targetLanguage);
      
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

  private async blobToBase64(blob: Blob): Promise<string> {
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

  private getMimeType(blob: Blob): string {
    // Map file extensions to MIME types
    const mimeTypes: { [key: string]: string } = {
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
    
    // Default to wav if no type is available
    return 'audio/wav';
  }

  private createTranscriptionPrompt(originalLanguage?: string, targetLanguage?: string): string {
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

  private parseTranscriptionResponse(text: string, targetLanguage?: string): {
    originalText: string;
    translatedText?: string;
    detectedLanguage: string;
    confidence: number;
  } {
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

// Export a singleton instance
export const geminiService = GeminiTranscriptionService.getInstance();

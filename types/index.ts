export interface AudioFile {
  id: string;
  name: string;
  size: number;
  duration: number;
  format?: string;
  type?: string;
  url: string;
  uploadedAt: Date;
  status?: 'uploading' | 'ready' | 'processing' | 'completed' | 'error';
}

export interface TranscriptionResult {
  id: string;
  audioFileId: string;
  originalText: string;
  translatedText?: string;
  originalLanguage: string;
  targetLanguage?: string;
  confidence: number;
  timestamps: Timestamp[];
  createdAt: Date;
  processingTime: number;
}

export interface Timestamp {
  start: number;
  end: number;
  text: string;
  confidence: number;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  confidence?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UserPreferences {
  defaultTargetLanguage: string;
  audioQuality: 'low' | 'medium' | 'high';
  autoTranslate: boolean;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
}

export interface TranscriptionHistory {
  id: string;
  userId: string;
  audioFile: AudioFile;
  transcription: TranscriptionResult;
  tags: string[];
  isPublic: boolean;
  sharedAt?: Date;
}

export interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
}

export interface TranscriptionState {
  isProcessing: boolean;
  progress: number;
  currentStep: 'uploading' | 'processing' | 'translating' | 'completed';
  error: string | null;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentAudioFile: AudioFile | null;
  transcriptionResult: TranscriptionResult | null;
  transcriptionHistory: TranscriptionHistory[];
  selectedLanguages: {
    original: Language | null;
    target: Language | null;
  };
  audioRecorder: AudioRecorderState;
  transcription: TranscriptionState;
}

export type SupportedAudioFormat = 'mp3' | 'wav' | 'ogg' | 'm4a' | 'flac';

export interface ExportOptions {
  format: 'txt' | 'docx' | 'pdf';
  includeTimestamps: boolean;
  includeConfidence: boolean;
  includeTranslation: boolean;
}

export interface TranscriptionSettings {
  languageDetection: boolean;
  autoTranslate: boolean;
  targetLanguage: string;
  audioEnhancement: boolean;
  speakerIdentification: boolean;
  keywordExtraction: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilters {
  query?: string;
  language?: string;
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
  status?: string;
}

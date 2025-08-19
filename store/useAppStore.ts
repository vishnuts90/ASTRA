import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AppState, 
  AudioFile, 
  TranscriptionResult, 
  Language, 
  User,
  AudioRecorderState,
  TranscriptionState,
  TranscriptionHistory
} from '@/types';

interface AppStore extends AppState {
  // User actions
  setUser: (user: User | null) => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  
  // Audio actions
  setCurrentAudioFile: (audioFile: AudioFile | null) => void;
  updateAudioFileStatus: (id: string, status: AudioFile['status']) => void;
  
  // Transcription actions
  setTranscriptionResult: (result: TranscriptionResult | null) => void;
  addTranscriptionToHistory: (history: TranscriptionHistory) => void;
  removeTranscriptionFromHistory: (id: string) => void;
  clearTranscriptionHistory: () => void;
  
  // Language actions
  setSelectedLanguages: (languages: { original: Language | null; target: Language | null }) => void;
  setOriginalLanguage: (language: Language | null) => void;
  setTargetLanguage: (language: Language | null) => void;
  
  // Audio recorder actions
  setAudioRecorderState: (state: Partial<AudioRecorderState>) => void;
  resetAudioRecorder: () => void;
  
  // Transcription processing actions
  setTranscriptionState: (state: Partial<TranscriptionState>) => void;
  resetTranscriptionState: () => void;
  
  // General actions
  resetApp: () => void;
}

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  currentAudioFile: null,
  transcriptionResult: null,
  transcriptionHistory: [
    // Sample data for testing
    {
      id: '1',
      userId: 'user_1',
      audioFile: {
        id: 'audio_1',
        name: 'Meeting Recording.mp3',
        size: 2048576,
        duration: 180,
        format: 'mp3',
        type: 'audio/mpeg',
        url: '#',
        uploadedAt: new Date(Date.now() - 86400000), // 1 day ago
        status: 'completed' as const,
      },
      transcription: {
        id: 'trans_1',
        audioFileId: 'audio_1',
        originalText: 'Hello everyone, welcome to our weekly team meeting. Today we will discuss the progress of our ASTRA project and plan the next steps for development.',
        translatedText: 'Hola a todos, bienvenidos a nuestra reunión semanal del equipo. Hoy discutiremos el progreso de nuestro proyecto ASTRA y planificaremos los próximos pasos para el desarrollo.',
        originalLanguage: 'English',
        targetLanguage: 'Spanish',
        confidence: 0.95,
        timestamps: [],
        createdAt: new Date(Date.now() - 86400000),
        processingTime: 15000,
      },
      tags: ['meeting', 'team', 'project'],
      isPublic: false,
    },
    {
      id: '2',
      userId: 'user_1',
      audioFile: {
        id: 'audio_2',
        name: 'Interview Session.wav',
        size: 5120000,
        duration: 300,
        format: 'wav',
        type: 'audio/wav',
        url: '#',
        uploadedAt: new Date(Date.now() - 172800000), // 2 days ago
        status: 'completed' as const,
      },
      transcription: {
        id: 'trans_2',
        audioFileId: 'audio_2',
        originalText: 'Thank you for joining us today. Could you tell us about your experience with audio transcription technology and how it has helped in your workflow?',
        translatedText: 'Gracias por unirse a nosotros hoy. ¿Podría contarnos sobre su experiencia con la tecnología de transcripción de audio y cómo ha ayudado en su flujo de trabajo?',
        originalLanguage: 'English',
        targetLanguage: 'Spanish',
        confidence: 0.92,
        timestamps: [],
        createdAt: new Date(Date.now() - 172800000),
        processingTime: 18000,
      },
      tags: ['interview', 'technology', 'workflow'],
      isPublic: false,
    },
  ],
  selectedLanguages: {
    original: null,
    target: null,
  },
  audioRecorder: {
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null,
    error: null,
  },
  transcription: {
    isProcessing: false,
    progress: 0,
    currentStep: 'uploading',
    error: null,
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // User actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      updateUserPreferences: (preferences) => set((state) => ({
        user: state.user ? {
          ...state.user,
          preferences: { ...state.user.preferences, ...preferences }
        } : null
      })),
      
      // Audio actions
      setCurrentAudioFile: (audioFile) => set({ currentAudioFile: audioFile }),
      
      updateAudioFileStatus: (id, status) => set((state) => ({
        currentAudioFile: state.currentAudioFile?.id === id 
          ? { ...state.currentAudioFile, status }
          : state.currentAudioFile,
        transcriptionHistory: state.transcriptionHistory.map(history => 
          history.audioFile.id === id 
            ? { ...history, audioFile: { ...history.audioFile, status } }
            : history
        )
      })),
      
      // Transcription actions
      setTranscriptionResult: (result) => set({ transcriptionResult: result }),
      
      addTranscriptionToHistory: (history) => set((state) => ({
        transcriptionHistory: [history, ...state.transcriptionHistory]
      })),
      
      removeTranscriptionFromHistory: (id) => set((state) => ({
        transcriptionHistory: state.transcriptionHistory.filter(h => h.id !== id)
      })),
      
      clearTranscriptionHistory: () => set({ transcriptionHistory: [] }),
      
      // Language actions
      setSelectedLanguages: (languages) => set({ selectedLanguages: languages }),
      
      setOriginalLanguage: (language) => set((state) => ({
        selectedLanguages: { ...state.selectedLanguages, original: language }
      })),
      
      setTargetLanguage: (language) => set((state) => ({
        selectedLanguages: { ...state.selectedLanguages, target: language }
      })),
      
      // Audio recorder actions
      setAudioRecorderState: (state) => set((currentState) => ({
        audioRecorder: { ...currentState.audioRecorder, ...state }
      })),
      
      resetAudioRecorder: () => set((state) => ({
        audioRecorder: { ...initialState.audioRecorder }
      })),
      
      // Transcription processing actions
      setTranscriptionState: (state) => set((currentState) => ({
        transcription: { ...currentState.transcription, ...state }
      })),
      
      resetTranscriptionState: () => set((state) => ({
        transcription: { ...initialState.transcription }
      })),
      
      // General actions
      resetApp: () => set(initialState),
    }),
    {
      name: 'astra-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        transcriptionHistory: state.transcriptionHistory,
        selectedLanguages: state.selectedLanguages,
      }),
    }
  )
);

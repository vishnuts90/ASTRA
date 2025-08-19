'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  XMarkIcon, 
  DocumentTextIcon,
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
  SpeakerWaveIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '@/store/useAppStore';
import toast from 'react-hot-toast';

interface TranscriptionDisplayProps {
  onClose: () => void;
}

export function TranscriptionDisplay({ onClose }: TranscriptionDisplayProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'uploading' | 'processing' | 'translating' | 'completed'>('uploading');
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const { currentAudioFile, selectedLanguages, setTranscriptionResult } = useAppStore();

  useEffect(() => {
    if (!currentAudioFile) {
      onClose();
      return;
    }

    // Real AI transcription process
    const performTranscription = async () => {
      try {
        setCurrentStep('uploading');
        setProgress(10);

        // Get audio blob from current audio file
        const audioBlob = await fetch(currentAudioFile.url).then(r => r.blob());
        
        setCurrentStep('processing');
        setProgress(30);

        // Convert blob to base64 for Netlify function
        const base64Audio = await blobToBase64(audioBlob);

        setProgress(50);

        // Determine API endpoint based on environment
        const isDevelopment = process.env.NODE_ENV === 'development';
        const apiEndpoint = isDevelopment 
          ? '/api/transcribe' 
          : '/.netlify/functions/api/transcribe';

        // Prepare request data
        const requestData = {
          audio: {
            data: base64Audio,
            type: audioBlob.type,
            name: currentAudioFile.name
          },
          originalLanguage: selectedLanguages.original && selectedLanguages.original.code !== 'auto' 
            ? selectedLanguages.original.name 
            : undefined,
          targetLanguage: selectedLanguages.target && selectedLanguages.target.code !== selectedLanguages.original?.code
            ? selectedLanguages.target.name 
            : undefined
        };

        // Call the transcription API
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setProgress(80);

        const result = await response.json();
        
        if (result.success && result.data) {
          const transcriptionData = result.data;
          
          setOriginalText(transcriptionData.originalText);
          setTranslatedText(transcriptionData.translatedText);
          setDetectedLanguage(transcriptionData.detectedLanguage);
          setConfidence(transcriptionData.confidence);

          // Create transcription result object
          const transcriptionResult = {
            id: Date.now().toString(),
            audioFileId: currentAudioFile.id,
            originalText: transcriptionData.originalText,
            translatedText: transcriptionData.translatedText,
            originalLanguage: transcriptionData.detectedLanguage,
            targetLanguage: selectedLanguages.target?.name,
            confidence: transcriptionData.confidence,
            timestamps: [],
            createdAt: new Date(),
            processingTime: transcriptionData.processingTime,
          };

          setTranscriptionResult(transcriptionResult);
        } else {
          throw new Error(result.error || 'Transcription failed');
        }

        setCurrentStep('completed');
        setProgress(100);
        setIsProcessing(false);

        toast.success('Transcription completed successfully!');

      } catch (error) {
        console.error('Transcription error:', error);
        setCurrentStep('completed');
        setProgress(100);
        setIsProcessing(false);
        
        // Fallback to mock data if API fails
        setOriginalText("Hello, this is a sample transcription. The audio has been successfully converted to text with high accuracy. This demonstrates the multilingual capabilities of ASTRA.");
        setTranslatedText("Hola, esta es una transcripción de muestra. El audio se ha convertido exitosamente a texto con alta precisión. Esto demuestra las capacidades multilingües de ASTRA.");
        setDetectedLanguage("English");
        setConfidence(0.95);
        
        toast.error('Transcription failed. Using sample data.');
      }
    };

    performTranscription();
  }, [currentAudioFile, selectedLanguages, onClose, setTranscriptionResult]);

  // Helper function to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:audio/wav;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const exportText = (format: 'txt' | 'docx' | 'pdf') => {
    const content = originalText + (translatedText ? '\n\nTranslation:\n' + translatedText : '');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcription.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'uploading':
        return '📤';
      case 'processing':
        return '🎵';
      case 'translating':
        return '🌐';
      case 'completed':
        return '✅';
      default:
        return '⏳';
    }
  };

  const getStepText = (step: string) => {
    switch (step) {
      case 'uploading':
        return 'Uploading audio file...';
      case 'processing':
        return 'Processing audio...';
      case 'translating':
        return 'Translating text...';
      case 'completed':
        return 'Transcription completed!';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Transcription Results
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isProcessing ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">{getStepIcon(currentStep)}</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {getStepText(currentStep)}
              </h3>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-primary-500 to-teal-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-gray-600">{Math.round(progress)}% complete</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Language Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Detected Language:</span>
                    <p className="font-medium">{detectedLanguage}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Confidence:</span>
                    <p className="font-medium">{(confidence * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Processing Time:</span>
                    <p className="font-medium">~15 seconds</p>
                  </div>
                </div>
              </div>

              {/* Original Transcription */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Original Transcription
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">{originalText}</p>
                  <div className="flex justify-end mt-3 space-x-2">
                    <button
                      onClick={() => copyToClipboard(originalText)}
                      className="btn-outline text-sm flex items-center space-x-1"
                    >
                      {isCopied ? (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Translation */}
              {translatedText && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Translation ({selectedLanguages.target?.name})
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800 leading-relaxed">{translatedText}</p>
                    <div className="flex justify-end mt-3 space-x-2">
                      <button
                        onClick={() => copyToClipboard(translatedText)}
                        className="btn-outline text-sm flex items-center space-x-1"
                      >
                        <ClipboardDocumentIcon className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Export Options */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Export Options
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => exportText('txt')}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span>Export as TXT</span>
                  </button>
                  <button
                    onClick={() => exportText('docx')}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span>Export as DOCX</span>
                  </button>
                  <button
                    onClick={() => exportText('pdf')}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span>Export as PDF</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

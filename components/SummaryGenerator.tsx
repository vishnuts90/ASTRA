'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { TranscriptionResult } from '@/types';

interface SummaryGeneratorProps {
  transcription: TranscriptionResult;
  onClose: () => void;
}

type SummaryType = 'brief' | 'detailed' | 'key-points';

interface SummaryOption {
  type: SummaryType;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

const summaryOptions: SummaryOption[] = [
  {
    type: 'brief',
    title: 'Brief Summary',
    description: 'A concise overview of the main points',
    icon: DocumentTextIcon
  },
  {
    type: 'detailed',
    title: 'Detailed Summary',
    description: 'Comprehensive analysis with context',
    icon: DocumentTextIcon
  },
  {
    type: 'key-points',
    title: 'Key Points',
    description: 'Bullet points of important information',
    icon: SparklesIcon
  }
];

export function SummaryGenerator({ transcription, onClose }: SummaryGeneratorProps) {
  const [selectedType, setSelectedType] = useState<SummaryType>('brief');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI summary generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const text = transcription.originalText;
      let generatedSummary = '';
      
      switch (selectedType) {
        case 'brief':
          generatedSummary = `This ${text.length > 500 ? 'detailed' : 'brief'} audio recording covers ${text.split(' ').length} words of content. The main topic appears to be related to ${text.toLowerCase().includes('meeting') ? 'a meeting discussion' : 'general conversation'}. Key themes include communication and information sharing.`;
          break;
        case 'detailed':
          generatedSummary = `Detailed Analysis:\n\nThis transcription contains ${text.split(' ').length} words and covers multiple topics. The content appears to be ${text.toLowerCase().includes('presentation') ? 'a presentation' : text.toLowerCase().includes('interview') ? 'an interview' : 'a conversation'}.\n\nMain Points:\n• Content length: ${text.length} characters\n• Language: ${transcription.originalLanguage}\n• Confidence: ${Math.round(transcription.confidence * 100)}%\n• Processing time: ${transcription.processingTime}ms\n\nSummary: The audio provides comprehensive information with high accuracy transcription. The content is well-structured and covers important details that would be valuable for documentation purposes.`;
          break;
        case 'key-points':
          generatedSummary = `Key Points Extracted:\n\n• Audio Duration: ${transcription.processingTime}ms processing time\n• Language: ${transcription.originalLanguage}\n• Accuracy: ${Math.round(transcription.confidence * 100)}%\n• Word Count: ${text.split(' ').length} words\n• Character Count: ${text.length} characters\n• Content Type: ${text.toLowerCase().includes('meeting') ? 'Meeting' : text.toLowerCase().includes('presentation') ? 'Presentation' : 'Conversation'}\n• Quality: ${transcription.confidence > 0.9 ? 'Excellent' : transcription.confidence > 0.8 ? 'Good' : 'Fair'}\n• Translation: ${transcription.translatedText ? 'Available' : 'Not requested'}`;
          break;
      }
      
      setSummary(generatedSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${selectedType}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <div className="card glass-effect p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    AI Summary Generator
                  </h2>
                  <p className="text-sm text-gray-600">
                    Generate intelligent summaries of your transcription
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Summary Type Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Choose Summary Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {summaryOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => setSelectedType(option.type)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedType === option.type
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedType === option.type
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <option.icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900">
                          {option.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="mb-8">
              <button
                onClick={generateSummary}
                disabled={isGenerating}
                className="w-full btn-primary py-4 flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    Generate {summaryOptions.find(opt => opt.type === selectedType)?.title}
                  </>
                )}
              </button>
            </div>

            {/* Summary Display */}
            {summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Generated Summary
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="btn-outline flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={downloadSummary}
                      className="btn-outline flex items-center gap-2"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                    {summary}
                  </pre>
                </div>
              </motion.div>
            )}

            {/* Original Text Preview */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Original Transcription
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                <p className="text-sm text-gray-600 line-clamp-6">
                  {transcription.originalText}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

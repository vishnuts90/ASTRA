'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MicrophoneIcon, 
  CloudArrowUpIcon, 
  GlobeAltIcon,
  SparklesIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { AudioRecorder } from '@/components/AudioRecorder';
import { FileUpload } from '@/components/FileUpload';
import { LanguageSelector } from '@/components/LanguageSelector';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'record' | 'upload'>('record');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const features = [
    {
      icon: MicrophoneIcon,
      title: 'Live Recording',
      description: 'Record audio directly from your microphone with real-time level monitoring'
    },
    {
      icon: CloudArrowUpIcon,
      title: 'File Upload',
      description: 'Upload audio files in multiple formats (MP3, WAV, OGG, M4A, FLAC)'
    },
    {
      icon: GlobeAltIcon,
      title: '50+ Languages',
      description: 'Automatic language detection and transcription in the original language'
    },
    {
      icon: SparklesIcon,
      title: 'Smart Translation',
      description: 'Optional translation to your preferred target language with high accuracy'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-teal-500/10 to-orange-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 via-teal-600 to-orange-600 bg-clip-text text-transparent mb-6">
                ASTRA
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
                Audio-to-Text Real-Time Application with advanced multilingual capabilities
              </p>
              <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                Convert audio files to text with intelligent language detection, manual transcription control, 
                and seamless translation features.
              </p>
            </motion.div>

            {/* Main Action Area */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="card glass-effect">
                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('record')}
                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors ${
                      activeTab === 'record'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <MicrophoneIcon className="w-5 h-5 mr-2" />
                    Record Audio
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors ${
                      activeTab === 'upload'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                    Upload File
                  </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                  {activeTab === 'record' ? (
                    <AudioRecorder onTranscribe={() => setIsTranscribing(true)} />
                  ) : (
                    <FileUpload onTranscribe={() => setIsTranscribing(true)} />
                  )}
                </div>

                {/* Language Selection */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <LanguageSelector />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Seamless Transcription
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for accurate, multilingual audio-to-text conversion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transcription Display */}
      {isTranscribing && (
        <TranscriptionDisplay onClose={() => setIsTranscribing(false)} />
      )}

      <Footer />
    </div>
  );
}

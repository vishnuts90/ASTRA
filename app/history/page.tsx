'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  TrashIcon,
  DocumentTextIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '@/store/useAppStore';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TranscriptionHistory, Language } from '@/types';

export default function HistoryPage() {
  const { transcriptionHistory, removeTranscriptionFromHistory, selectedLanguages, setSelectedLanguages } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [filteredHistory, setFilteredHistory] = useState<TranscriptionHistory[]>([]);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);

  // Set default date range to current month
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setDateFrom(firstDay.toISOString().split('T')[0]);
    setDateTo(lastDay.toISOString().split('T')[0]);
  }, []);

  // Filter history based on search criteria
  useEffect(() => {
    let filtered = transcriptionHistory;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.audioFile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.transcription.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.transcription.translatedText && item.transcription.translatedText.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(item => 
        new Date(item.transcription.createdAt) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      filtered = filtered.filter(item => 
        new Date(item.transcription.createdAt) <= new Date(dateTo + 'T23:59:59')
      );
    }

    // Filter by language
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(item => 
        item.transcription.originalLanguage.toLowerCase() === selectedLanguage.toLowerCase()
      );
    }

    setFilteredHistory(filtered);
  }, [transcriptionHistory, searchQuery, dateFrom, dateTo, selectedLanguage]);

  const handleRegenerateTranscription = async (historyItem: TranscriptionHistory) => {
    setIsRegenerating(historyItem.id);
    
    try {
      // Simulate regeneration process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would call the actual regeneration API
      // For now, we'll just show a success message
      console.log('Regenerating transcription for:', historyItem.id);
      
    } catch (error) {
      console.error('Error regenerating transcription:', error);
    } finally {
      setIsRegenerating(null);
    }
  };

  const handleDeleteTranscription = (id: string) => {
    if (confirm('Are you sure you want to delete this transcription?')) {
      removeTranscriptionFromHistory(id);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const languages = [
    { code: 'all', name: 'All Languages' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'ar', name: 'Arabic' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-teal-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Transcription History
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access and manage all your previous transcriptions with advanced search and filtering
            </p>
          </motion.div>

          {/* Search and Filter Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card glass-effect mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transcriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Date From */}
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Date To */}
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Language Filter */}
              <div className="relative">
                <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <p className="text-gray-600">
              Found {filteredHistory.length} transcription{filteredHistory.length !== 1 ? 's' : ''}
            </p>
          </motion.div>

          {/* History List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {filteredHistory.length === 0 ? (
              <div className="card glass-effect text-center py-12">
                <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No transcriptions found</h3>
                <p className="text-gray-600">
                  {transcriptionHistory.length === 0 
                    ? "You haven't created any transcriptions yet. Start by recording or uploading audio."
                    : "Try adjusting your search criteria to find what you're looking for."
                  }
                </p>
              </div>
            ) : (
              filteredHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="card glass-effect hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Audio Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-teal-500 rounded-lg flex items-center justify-center">
                          <SpeakerWaveIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.audioFile.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDuration(item.audioFile.duration)} • {formatDate(item.transcription.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Language Info */}
                      <div className="flex items-center gap-4 mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.transcription.originalLanguage}
                        </span>
                        {item.transcription.targetLanguage && (
                          <>
                            <span className="text-gray-400">→</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {item.transcription.targetLanguage}
                            </span>
                          </>
                        )}
                        <span className="text-sm text-gray-500">
                          Confidence: {Math.round(item.transcription.confidence * 100)}%
                        </span>
                      </div>

                      {/* Transcription Preview */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {item.transcription.originalText}
                        </p>
                        {item.transcription.translatedText && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {item.transcription.translatedText}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleRegenerateTranscription(item)}
                        disabled={isRegenerating === item.id}
                        className="btn-outline flex items-center justify-center gap-2"
                      >
                        {isRegenerating === item.id ? (
                          <>
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            Regenerating...
                          </>
                        ) : (
                          <>
                            <ArrowPathIcon className="w-4 h-4" />
                            Regenerate
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteTranscription(item.id)}
                        className="btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center justify-center gap-2"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '@/store/useAppStore';
import { Language } from '@/types';

const languages: Language[] = [
  { code: 'auto', name: 'Auto Detect', nativeName: 'Auto Detect' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
];

export function LanguageSelector() {
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const { selectedLanguages, setOriginalLanguage, setTargetLanguage } = useAppStore();

  const handleOriginalSelect = (language: Language) => {
    setOriginalLanguage(language);
    setIsOriginalOpen(false);
  };

  const handleTargetSelect = (language: Language) => {
    setTargetLanguage(language);
    setIsTargetOpen(false);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
        <GlobeAltIcon className="w-5 h-5 mr-2" />
        Language Settings
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Language */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Original Language
          </label>
          <div className="relative">
            <button
              onClick={() => setIsOriginalOpen(!isOriginalOpen)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <span className="flex items-center">
                {selectedLanguages.original ? (
                  <>
                    <span className="font-medium">{selectedLanguages.original.name}</span>
                    <span className="text-gray-500 ml-2">({selectedLanguages.original.nativeName})</span>
                  </>
                ) : (
                  <span className="text-gray-500">Select language</span>
                )}
              </span>
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </button>
            
            {isOriginalOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleOriginalSelect(language)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <div className="font-medium">{language.name}</div>
                    <div className="text-sm text-gray-500">{language.nativeName}</div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Target Language */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Language (Translation)
          </label>
          <div className="relative">
            <button
              onClick={() => setIsTargetOpen(!isTargetOpen)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <span className="flex items-center">
                {selectedLanguages.target ? (
                  <>
                    <span className="font-medium">{selectedLanguages.target.name}</span>
                    <span className="text-gray-500 ml-2">({selectedLanguages.target.nativeName})</span>
                  </>
                ) : (
                  <span className="text-gray-500">Select language</span>
                )}
              </span>
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </button>
            
            {isTargetOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {languages.filter(lang => lang.code !== 'auto').map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleTargetSelect(language)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <div className="font-medium">{language.name}</div>
                    <div className="text-sm text-gray-500">{language.nativeName}</div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

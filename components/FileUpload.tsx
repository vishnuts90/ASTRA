'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { AudioFile, SupportedAudioFormat } from '@/types';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onTranscribe: () => void;
}

const supportedFormats: SupportedAudioFormat[] = ['mp3', 'wav', 'ogg', 'm4a', 'flac'];
const maxFileSize = 100 * 1024 * 1024; // 100MB

export function FileUpload({ onTranscribe }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const { setCurrentAudioFile } = useAppStore();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(({ file, errors }) => {
        if (errors.some((e: any) => e.code === 'file-too-large')) {
          return `${file.name} is too large. Maximum size is 100MB.`;
        }
        if (errors.some((e: any) => e.code === 'file-invalid-type')) {
          return `${file.name} is not a supported audio format.`;
        }
        return `${file.name} could not be uploaded.`;
      });
      errors.forEach(error => toast.error(error));
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setUploadedFile(file);
      setAudioUrl(url);

      // Get audio duration
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      // Create audio file object
      const audioFile: AudioFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: url,
        duration: 0,
        uploadedAt: new Date(),
      };

      setCurrentAudioFile(audioFile);
      toast.success(`${file.name} uploaded successfully!`);
    }
  }, [setCurrentAudioFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': supportedFormats.map(format => `.${format}`) },
    maxSize: maxFileSize,
    multiple: false,
  });

  const removeFile = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setUploadedFile(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setIsMuted(false);
    setDuration(0);
    setCurrentTime(0);
    setCurrentAudioFile(null);
  };

  const togglePlayback = () => {
    const audio = document.querySelector('audio');
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  };

  const toggleMute = () => {
    const audio = document.querySelector('audio');
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Upload Audio File
        </h3>
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? 'Drop the audio file here' : 'Drag & drop audio file'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  or click to browse files
                </p>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                <p>Supported formats: MP3, WAV, OGG, M4A, FLAC</p>
                <p>Maximum file size: 100MB</p>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DocumentIcon className="w-8 h-8 text-primary-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{uploadedFile.name}</h4>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(uploadedFile.size)} • {formatTime(duration)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Audio Player */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <audio
                src={audioUrl || undefined}
                onTimeUpdate={(e) => setCurrentTime((e.target as HTMLAudioElement).currentTime)}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full"
                controls
              />
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%'
                }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={togglePlayback}
                className="btn-primary flex items-center"
              >
                {isPlaying ? (
                  <PauseIcon className="w-5 h-5 mr-2" />
                ) : (
                  <PlayIcon className="w-5 h-5 mr-2" />
                )}
                {isPlaying ? 'Pause Playback' : 'Play Preview'}
              </button>
              <button
                onClick={toggleMute}
                className="btn-outline flex items-center"
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="w-5 h-5 mr-2" />
                ) : (
                  <SpeakerWaveIcon className="w-5 h-5 mr-2" />
                )}
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <button
                onClick={onTranscribe}
                className="btn-secondary flex items-center"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                Transcribe Now
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

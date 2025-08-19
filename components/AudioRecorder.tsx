'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MicrophoneIcon, 
  PlayIcon, 
  PauseIcon, 
  StopIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '@/store/useAppStore';
import toast from 'react-hot-toast';

interface AudioRecorderProps {
  onTranscribe: () => void;
}

export function AudioRecorder({ onTranscribe }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const { setAudioRecorderState, setCurrentAudioFile } = useAppStore();

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });

      // Set up audio context for level monitoring
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      microphoneRef.current.connect(analyserRef.current);

      // Create MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Create audio file object
        const audioFile = {
          id: Date.now().toString(),
          name: `Recording_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.wav`,
          size: blob.size,
          duration: duration,
          format: 'wav',
          url: url,
          uploadedAt: new Date(),
          status: 'ready' as const,
        };
        
        setCurrentAudioFile(audioFile);
        setAudioRecorderState({
          audioBlob: blob,
          audioUrl: url,
          isRecording: false,
          isPaused: false,
          duration: duration,
          error: null,
        });
      };

      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setDuration(0);
      setAudioRecorderState({ isRecording: true, isPaused: false, duration: 0 });

      // Start timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
        setAudioRecorderState({ duration: duration + 1 });
      }, 1000);

      // Start audio level monitoring
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
        }
        
        if (isRecording) {
          requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();

      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
      setAudioRecorderState({ error: 'Failed to start recording' });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      setAudioRecorderState({ isPaused: true });
      toast.success('Recording paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      setAudioRecorderState({ isPaused: false });
      toast.success('Recording resumed');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      setIsRecording(false);
      setIsPaused(false);
      setAudioRecorderState({ isRecording: false, isPaused: false });
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      toast.success('Recording completed');
    }
  };

  const playRecording = () => {
    if (audioUrl && audioElementRef.current) {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const pausePlayback = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioElementRef.current) {
      audioElementRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Record Audio
        </h3>
        
        {/* Audio Level Indicator */}
        <div className="mb-6">
          <div className="w-32 h-32 mx-auto relative">
            <div className="w-full h-full rounded-full border-4 border-gray-200 flex items-center justify-center">
              {isRecording && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 opacity-20"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              
              {/* Audio Level Bars */}
              {isRecording && (
                <div className="flex items-end justify-center space-x-1 h-16">
                  {Array.from({ length: 8 }, (_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-gradient-to-t from-primary-500 to-teal-500 rounded-full"
                      animate={{
                        height: [
                          Math.max(4, (audioLevel / 255) * 60 * (i + 1) / 8),
                          Math.max(4, (audioLevel / 255) * 60 * (i + 1) / 8) + 10,
                          Math.max(4, (audioLevel / 255) * 60 * (i + 1) / 8),
                        ],
                      }}
                      transition={{
                        duration: 0.1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              )}
              
              <MicrophoneIcon className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="text-2xl font-mono text-gray-700 mb-6">
          {formatTime(duration)}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="btn-primary flex items-center space-x-2"
            >
              <MicrophoneIcon className="w-5 h-5" />
              <span>Start Recording</span>
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  onClick={resumeRecording}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  onClick={pauseRecording}
                  className="btn-outline flex items-center space-x-2"
                >
                  <PauseIcon className="w-5 h-5" />
                  <span>Pause</span>
                </button>
              )}
              
              <button
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <StopIcon className="w-5 h-5" />
                <span>Stop</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Audio Playback */}
      {audioUrl && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Audio Preview
          </h4>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={isPlaying ? pausePlayback : playRecording}
              className="btn-primary flex items-center space-x-2"
            >
              {isPlaying ? (
                <>
                  <PauseIcon className="w-5 h-5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-5 h-5" />
                  <span>Play</span>
                </>
              )}
            </button>
            
            <button
              onClick={toggleMute}
              className="btn-outline flex items-center space-x-2"
            >
              {isMuted ? (
                <>
                  <SpeakerXMarkIcon className="w-5 h-5" />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <SpeakerWaveIcon className="w-5 h-5" />
                  <span>Mute</span>
                </>
              )}
            </button>
            
            <button
              onClick={onTranscribe}
              className="btn-secondary flex items-center space-x-2"
            >
              <span>Transcribe</span>
            </button>
          </div>
          
          <audio
            ref={audioElementRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="w-full mt-4"
            controls
          />
        </div>
      )}
    </div>
  );
}

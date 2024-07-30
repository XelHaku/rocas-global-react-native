// hooks/useTTS.ts
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import useAppStore from '@/store/store';

let Tts: any;
if (Platform.OS !== 'web') {
  Tts = require('react-native-tts').default;
}

export const useTTS = () => {
  const { 
    ttsConfig,
    isPlaying,
    setIsPlaying,
    isPaused,
    setIsPaused,
    currentPosition,
    setCurrentPosition
  } = useAppStore();

  const [ttsAvailable, setTtsAvailable] = useState(false);

  useEffect(() => {
    const initTts = async () => {
      if (Platform.OS === 'web') {
        setTtsAvailable('speechSynthesis' in window);
      } else if (Tts) {
        try {
          await Tts.getInitStatus();
          await Tts.setDefaultLanguage('es-MX');
          await Tts.setDefaultRate(ttsConfig.speechRate);
          await Tts.setDefaultPitch(ttsConfig.speechPitch);
          setTtsAvailable(true);
        } catch (err) {
          console.error('Error initializing TTS:', err);
          setTtsAvailable(false);
        }
      }
    };

    initTts();

    return () => {
      stopSpeech();
    };
  }, [ttsConfig.speechRate, ttsConfig.speechPitch]);

  const startSpeech = useCallback((text: string) => {
    if (Platform.OS === 'web') {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-MX';
        utterance.rate = ttsConfig.speechRate;
        utterance.pitch = ttsConfig.speechPitch;
        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentPosition(0);
        };
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        setIsPaused(false);
      } else {
        console.log('Web Speech API is not supported in this browser');
        alert('La síntesis de voz no está disponible en este navegador');
      }
    } else if (ttsAvailable && Tts) {
      Tts.stop();
      Tts.speak(text, {
        androidParams: {
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
          KEY_PARAM_VOLUME: 1,
          KEY_PARAM_PAN: 0,
        },
        rate: ttsConfig.speechRate,
        pitch: ttsConfig.speechPitch,
      });
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentPosition(0);
      Tts.addEventListener('tts-finish', () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentPosition(0);
      });
    } else {
      console.log('TTS is not available on this platform');
      alert('La síntesis de voz no está disponible en esta plataforma');
    }
  }, [ttsConfig, ttsAvailable, setIsPlaying, setIsPaused, setCurrentPosition]);

  const pauseSpeech = useCallback(() => {
    if (Platform.OS === 'web') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
    } else if (Tts) {
      Tts.pause();
    }
    setIsPaused(true);
  }, [setIsPaused]);

  const resumeSpeech = useCallback(() => {
    if (Platform.OS === 'web') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
    } else if (Tts) {
      Tts.resume();
    }
    setIsPaused(false);
  }, [setIsPaused]);

  const stopSpeech = useCallback(() => {
    if (Platform.OS === 'web') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else if (Tts) {
      Tts.stop();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentPosition(0);
  }, [setIsPlaying, setIsPaused, setCurrentPosition]);

  return {
    startSpeech,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    isPlaying,
    isPaused,
    currentPosition,
  };
};
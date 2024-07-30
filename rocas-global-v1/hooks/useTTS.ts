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
          setCurrentPosition(0);
        };
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
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
      setCurrentPosition(0);
      Tts.addEventListener('tts-finish', () => {
        setIsPlaying(false);
        setCurrentPosition(0);
      });
    } else {
      console.log('TTS is not available on this platform');
      alert('La síntesis de voz no está disponible en esta plataforma');
    }
  }, [ttsConfig, ttsAvailable, setIsPlaying, setCurrentPosition]);

  const stopSpeech = useCallback(() => {
    if (Platform.OS === 'web') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else if (Tts) {
      Tts.stop();
    }
    setIsPlaying(false);
    setCurrentPosition(0);
  }, [setIsPlaying, setCurrentPosition]);

  return {
    startSpeech,
    stopSpeech,
    isPlaying,
  };
};
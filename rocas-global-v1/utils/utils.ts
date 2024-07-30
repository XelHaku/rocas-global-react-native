import { Platform } from 'react-native';

let Tts: any;
if (Platform.OS !== 'web') {
  Tts = require('react-native-tts').default;
}

export const getColors = (theme: 'light' | 'dark') => ({
  background: theme === 'light' ? '#FFFFFF' : '#121212',
  card: theme === 'light' ? '#F2E8C9' : '#2C2C2C',
});

export const initTts = async (ttsConfig: { speechRate: number; speechPitch: number }, setTtsAvailable: (available: boolean) => void) => {
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

export const handleSpeech = (
  action: 'start' | 'pause' | 'resume' | 'stop' | 'restart',
  {
    setIsPlaying,
    setIsPaused,
    setCurrentPosition,
    text,
    ttsConfig,
  }: {
    setIsPlaying: (isPlaying: boolean) => void;
    setIsPaused: (isPaused: boolean) => void;
    setCurrentPosition: (position: number) => void;
    text?: string;
    ttsConfig?: { speechRate: number; speechPitch: number };
  }
) => {
  if (Platform.OS === 'web') {
    if ('speechSynthesis' in window) {
      switch (action) {
        case 'start':
          if (text) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-MX';
            utterance.rate = ttsConfig?.speechRate || 1;
            utterance.pitch = ttsConfig?.speechPitch || 1;
            utterance.onend = () => {
              setIsPlaying(false);
              setIsPaused(false);
            };
            window.speechSynthesis.speak(utterance);
            setIsPlaying(true);
            setIsPaused(false);
          }
          break;
        case 'pause':
          window.speechSynthesis.pause();
          setIsPaused(true);
          break;
        case 'resume':
          window.speechSynthesis.resume();
          setIsPaused(false);
          break;
        case 'stop':
        case 'restart':
          window.speechSynthesis.cancel();
          setIsPlaying(false);
          setIsPaused(false);
          if (action === 'restart' && text) {
            handleSpeech('start', { setIsPlaying, setIsPaused, setCurrentPosition, text, ttsConfig });
          }
          break;
      }
    }
  } else if (Tts) {
    switch (action) {
      case 'start':
        if (text) {
          Tts.speak(text, {
            androidParams: {
              KEY_PARAM_STREAM: 'STREAM_MUSIC',
              KEY_PARAM_VOLUME: 1,
              KEY_PARAM_PAN: 0,
            },
            rate: ttsConfig?.speechRate,
            pitch: ttsConfig?.speechPitch,
          });
          setIsPlaying(true);
          setIsPaused(false);
          setCurrentPosition(0);
          Tts.addEventListener('tts-finish', () => {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentPosition(0);
          });
        }
        break;
      case 'pause':
        Tts.stop();
        Tts.getCurrentPosition((position: number) => {
          setCurrentPosition(position);
        });
        setIsPaused(true);
        break;
      case 'resume':
        if (text) {
          Tts.speak(text.substring(setCurrentPosition as unknown as number), {
            androidParams: {
              KEY_PARAM_STREAM: 'STREAM_MUSIC',
              KEY_PARAM_VOLUME: 1,
              KEY_PARAM_PAN: 0,
            },
            rate: ttsConfig?.speechRate,
            pitch: ttsConfig?.speechPitch,
          });
        }
        setIsPaused(false);
        break;
      case 'stop':
      case 'restart':
        Tts.stop();
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentPosition(0);
        if (action === 'restart' && text) {
          handleSpeech('start', { setIsPlaying, setIsPaused, setCurrentPosition, text, ttsConfig });
        }
        break;
    }
  }
};
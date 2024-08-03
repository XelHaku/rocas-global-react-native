import { create } from 'zustand';
import { bibliaRV1960 } from '@/constants/bibliaRV1960';

type Theme = 'light' | 'dark';

interface BibleState {
  selectedBook: string;
  selectedChapter: number;
  favoriteVerses: string[];
}

interface TtsConfig {
  selectedVoice: string;
  speechRate: number;
  speechPitch: number;
  voiceGender: 'male' | 'female';
}

interface AuthState {
  isLoggedIn: boolean;
  userEmail: string | null;
}

interface AppStore extends BibleState, AuthState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSelectedBook: (book: string) => void;
  setSelectedChapter: (chapter: number) => void;
  toggleFavoriteVerse: (verse: string) => void;
  textToRead: string;
  setTextToRead: (text: string) => void;
  ttsConfig: TtsConfig;
  setTtsConfig: (config: Partial<TtsConfig>) => void;
  setSpeechRate: (rate: number) => void;
  setSpeechPitch: (pitch: number) => void;
  setVoiceGender: (gender: 'male' | 'female') => void;
  isFirstLaunch: boolean;
  setFirstLaunch: (firstLaunch: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  currentPosition: number;
  setCurrentPosition: (position: number) => void;
  login: (email: string) => void;
  logout: () => void;
}

const useAppStore = create<AppStore>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  activeTab: 'index',
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectedBook: bibliaRV1960[0].archivo,
  selectedChapter: 1,
  favoriteVerses: [],
  textToRead: '',
  setTextToRead: (text) => set({ textToRead: text }),
  setSelectedBook: (book) => set({ selectedBook: book, selectedChapter: 1 }),
  setSelectedChapter: (chapter) => set({ selectedChapter: chapter }),
  toggleFavoriteVerse: (verse) => set((state) => ({
    favoriteVerses: state.favoriteVerses.includes(verse)
      ? state.favoriteVerses.filter(v => v !== verse)
      : [...state.favoriteVerses, verse]
  })),
  ttsConfig: {
    selectedVoice: '',
    speechRate: 1.06,
    speechPitch: 0.45,
    voiceGender: 'female',
  },
  setTtsConfig: (config) => set((state) => ({
    ttsConfig: { ...state.ttsConfig, ...config }
  })),
  setSpeechRate: (rate) => set((state) => ({
    ttsConfig: { ...state.ttsConfig, speechRate: rate }
  })),
  setSpeechPitch: (pitch) => set((state) => ({
    ttsConfig: { ...state.ttsConfig, speechPitch: pitch }
  })),
  setVoiceGender: (gender) => set((state) => ({
    ttsConfig: { ...state.ttsConfig, voiceGender: gender }
  })),
  isFirstLaunch: true,
  setFirstLaunch: (firstLaunch) => set({ isFirstLaunch: firstLaunch }),
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  isPaused: false,
  setIsPaused: (isPaused) => set({ isPaused }),
  currentPosition: 0,
  setCurrentPosition: (position) => set({ currentPosition: position }),
  isLoggedIn: false,
  userEmail: null,
  login: (email) => set({ isLoggedIn: true, userEmail: email }),
  logout: () => set({ isLoggedIn: false, userEmail: null }),
}));

export default useAppStore;
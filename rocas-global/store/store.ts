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
}

interface AppStore extends BibleState {
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
  isFirstLaunch: boolean;
  setFirstLaunch: (firstLaunch: boolean) => void;
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
    speechRate: 0.5,
    speechPitch: 1.0,
  },
  setTtsConfig: (config) => set((state) => ({
    ttsConfig: { ...state.ttsConfig, ...config }
  })),
  isFirstLaunch: true,
  setFirstLaunch: (firstLaunch) => set({ isFirstLaunch: firstLaunch }),
}));

export default useAppStore;

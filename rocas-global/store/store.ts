import { create } from 'zustand'
import { bibliaRV1960 } from '@/constants/bibliaRV1960'

type Theme = 'light' | 'dark';

interface BibleState {
  selectedBook: string;
  selectedChapter: number;
  favoriteVerses: string[];
}

interface AppStore extends BibleState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSelectedBook: (book: string) => void;
  setSelectedChapter: (chapter: number) => void;
  toggleFavoriteVerse: (verse: string) => void;
  textToRead: string; // New state for the text to read
  setTextToRead: (text: string) => void; // New method to update the text to read
}

const useAppStore = create<AppStore>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  activeTab: 'index',
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectedBook: bibliaRV1960[0].archivo,
  selectedChapter: 1,
  favoriteVerses: [],
  textToRead: '', // Initialize the textToRead state
  setTextToRead: (text) => set({ textToRead: text }), // Implement the setTextToRead method
  setSelectedBook: (book) => set({ selectedBook: book, selectedChapter: 1 }),
  setSelectedChapter: (chapter) => set({ selectedChapter: chapter }),
  toggleFavoriteVerse: (verse) => set((state) => ({
    favoriteVerses: state.favoriteVerses.includes(verse)
      ? state.favoriteVerses.filter(v => v !== verse)
      : [...state.favoriteVerses, verse]
  })),
}));

export default useAppStore;

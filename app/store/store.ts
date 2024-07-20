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
}

const useStore = create<AppStore>((set) => ({
  theme: 'light',
  setTheme: (theme) => {
    console.log('Zustand: Cambiando tema a', theme);
    set({ theme })
  },
  activeTab: 'index',
  setActiveTab: (tab) => {
    console.log('Zustand: Cambiando tab activa a', tab);
    set({ activeTab: tab })
  },
  selectedBook: bibliaRV1960[0].archivo,
  selectedChapter: 1,
  favoriteVerses: [],
  setSelectedBook: (book) => set({ selectedBook: book, selectedChapter: 1 }),
  setSelectedChapter: (chapter) => set({ selectedChapter: chapter }),
  toggleFavoriteVerse: (verse) => set((state) => ({
    favoriteVerses: state.favoriteVerses.includes(verse)
      ? state.favoriteVerses.filter(v => v !== verse)
      : [...state.favoriteVerses, verse]
  })),
}))

export default useStore
import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

// Interfaz para el libro (ajustada para el ejemplo)
interface BookInterface {
  chapters: string[][]; // Array de capítulos, cada uno un array de versículos (strings)
}

interface ChapterVersePickerProps {
  book: BookInterface; // Libro ya no es nullable
  selectedVerse: { chapter: number; verse: number };
  onVerseChange: (newVerse: { chapter: number; verse: number }) => void;
}

export default function ChapterVersePicker({ book, selectedVerse, onVerseChange }: ChapterVersePickerProps) {
  const [selectedChapter, setSelectedChapter] = useState(selectedVerse.chapter);

  useEffect(() => {
    // Asegurar que el capítulo seleccionado esté dentro de los límites
    if (selectedChapter > book.chapters.length) {
      setSelectedChapter(1); // Volver al primer capítulo si es necesario
    }
  }, [book]);

  const handleChapterChange = (chapter: number) => {
    setSelectedChapter(chapter);
    const maxVerse = book.chapters[chapter - 1].length; 
    onVerseChange({ chapter, verse: Math.min(selectedVerse.verse, maxVerse) });
  };

  return (
    <View>
      <Picker selectedValue={selectedChapter} onValueChange={handleChapterChange}>
        {book.chapters.map((_, i) => (
          <Picker.Item key={i + 1} label={`Capítulo ${i + 1}`} value={i + 1} />
        ))}
      </Picker>

      <Picker selectedValue={selectedVerse.verse} onValueChange={(verse) => onVerseChange({ ...selectedVerse, verse })}>
        {Array.from({ length: book.chapters[selectedChapter - 1].length }, (_, i) => (
          <Picker.Item key={i + 1} label={`Versículo ${i + 1}`} value={i + 1} />
        ))}
      </Picker>
    </View>
  );
}
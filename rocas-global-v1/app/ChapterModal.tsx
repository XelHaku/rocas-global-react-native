/// app/ChapterModal.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Text, View } from "@/components/Themed";
import useAppStore from '@/store/app.store';
import { getChapterSummary } from '@/utils/openai/getChapterSummary';
import { useTTS } from '@/hooks/useTTS';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Función auxiliar para limpiar el nombre del libro
const cleanBookName = (bookName: string) => {
  return bookName.replace('.json', '').replace(/_/g, ' ');
};

// Función para dividir el texto en partes más pequeñas
const splitTextIntoParts = (text: string, maxLength: number = 200): string[] => {
  const parts: string[] = [];
  let currentPart = '';

  text.split('. ').forEach((sentence) => {
    if (currentPart.length + sentence.length > maxLength) {
      parts.push(currentPart.trim());
      currentPart = '';
    }
    currentPart += sentence + '. ';
  });

  if (currentPart) {
    parts.push(currentPart.trim());
  }

  return parts;
};

export default function ChapterModal() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [isReadingComplete, setIsReadingComplete] = useState(false);
  
  const selectedBook = useAppStore((state) => state.selectedBook);
  const selectedChapter = useAppStore((state) => state.selectedChapter);
  const { startSpeech, stopSpeech, isPlaying } = useTTS();

  const textPartsRef = useRef<string[]>([]);

  useEffect(() => {
    setLoading(true);
    getChapterSummary(selectedBook, selectedChapter)
      .then((result) => {
        setSummary(result);
        setLoading(false);
        const fullText = `Resumen: ${result.abstract}. Enseñanzas: ${result.teaching}`;
        textPartsRef.current = splitTextIntoParts(fullText);
      })
      .catch((error) => {
        console.error("Error fetching summary:", error);
        setSummary(null);
        setLoading(false);
      });
  }, [selectedBook, selectedChapter]);

  const cleanedBookName = cleanBookName(selectedBook);

  const playNextPart = useCallback(() => {
    if (currentPartIndex < textPartsRef.current.length) {
      startSpeech(textPartsRef.current[currentPartIndex]);
      setCurrentPartIndex(prevIndex => prevIndex + 1);
    } else {
      setIsReadingComplete(true);
    }
  }, [currentPartIndex, startSpeech]);

  useEffect(() => {
    if (!isPlaying && currentPartIndex < textPartsRef.current.length && !isReadingComplete) {
      playNextPart();
    }
  }, [isPlaying, currentPartIndex, playNextPart, isReadingComplete]);

  const handlePlayStop = useCallback(() => {
    if (isPlaying) {
      stopSpeech();
      setCurrentPartIndex(0);
      setIsReadingComplete(false);
    } else {
      setCurrentPartIndex(0);
      setIsReadingComplete(false);
      playNextPart();
    }
  }, [isPlaying, stopSpeech, playNextPart]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${cleanedBookName} - Capítulo ${selectedChapter}`}</Text>
      <View
        style={styles.separator}
        lightColor="#D4AF37"
        darkColor="#D4AF37"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#D4AF37" />
      ) : summary ? (
        <>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.summary}>{summary.abstract}</Text>
            <Text style={styles.summary}>{summary.teaching}</Text>
          </ScrollView>
          <View style={styles.ttsContainer}>
            <FontAwesome5 
              name={isPlaying ? "stop" : "play"} 
              size={24} 
              color="#D4AF37" 
              onPress={handlePlayStop}
            />
          </View>
        </>
      ) : (
        <Text style={styles.errorText}>Error al cargar el resumen. Por favor, intente de nuevo.</Text>
      )}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#F4E9D1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#5C4033',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 20,
    height: 2,
    width: '90%',
  },
  scrollView: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#8B4513',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  summary: {
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 20,
    color: '#3C2F1B',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  ttsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
import React, { useRef, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { bibliaRV1960 } from '@/constants/bibliaRV1960';
import { bibliaContent } from '@/constants/bibliaContent';
import useAppStore from '../store/store';
import ChapterModal from '../ChapterModal';
import * as Speech from 'expo-speech';

export default function Bible() {
  const { 
    selectedBook, 
    selectedChapter, 
    favoriteVerses, 
    setSelectedBook, 
    setSelectedChapter, 
    toggleFavoriteVerse 
  } = useAppStore();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const bookContent = bibliaContent[selectedBook as keyof typeof bibliaContent] || [];
  const chapterContent = bookContent[selectedChapter - 1] || [];

  const handleChapterChange = (chapter: number) => {
    setSelectedChapter(chapter);
    scrollViewRef.current?.scrollTo({
      x: (chapter - 1) * ITEM_WIDTH,
      animated: true,
    });
  };

  const speakContent = () => {
    const content = chapterContent.join(' ');
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(content, {
        language: "es-LA",
        pitch: 1.2,
        rate: 0.8,
        onDone: () => setIsSpeaking(false),
      });
    }
  };

  return (
    <View style={styles.container}>
      <Button 
        title={isSpeaking ? "Detener lectura" : "Leer capítulo"} 
        onPress={speakContent} 
      />

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chapterPicker}
        contentContainerStyle={styles.chapterPickerContent}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const chapter = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH) + 1;
          handleChapterChange(chapter);
        }}
      >
        {Array.from({ length: bookContent.length }, (_, i) => i + 1).map((chapter) => (
          <TouchableOpacity
            key={chapter}
            style={[
              styles.chapterItem,
              selectedChapter === chapter && styles.selectedChapterItem,
            ]}
            onPress={() => handleChapterChange(chapter)}
          >
            <Text>{chapter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.contentContainer}>
        {chapterContent.map((verse, index) => (
          <TouchableOpacity key={index} onPress={() => toggleFavoriteVerse(verse)}>
            <View style={[
              styles.verse, 
              favoriteVerses.includes(verse) && styles.favoriteVerse
            ]}>
              <Text style={styles.verseNumber}>{index + 1}</Text>
              <Text style={styles.verseText}>{verse}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ... (el resto del código, incluyendo los estilos, permanece igual)

const ITEM_WIDTH = 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 9,
  },
  picker: {
    height: 30,
    width: '100%',
    borderRadius: 10,            
    borderWidth: 1,              
    borderColor: '#ddd',       
    paddingHorizontal: 15,       
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
    padding: 20,        
    borderRadius: 10,   
    backgroundColor: '#fff', 
    elevation: 5,       
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  
  verse: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  verseNumber: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  verseText: {
    flex: 1,
  },
  chapterPicker: {
    marginTop: 10,
    maxHeight: 30,
  },
  chapterPickerContent: {
    paddingHorizontal: 10,
  },
  chapterItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  selectedChapterItem: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
  favoriteVerse: {
    backgroundColor: '#f0f0ff',
  },
});

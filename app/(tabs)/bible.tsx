//app\(tabs)\bible.tsx
import React, { useRef, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { bibliaRV1960 } from '@/constants/bibliaRV1960';
import { bibliaContent } from '@/constants/bibliaContent';

export default function Bible() {
  const [selectedBook, setSelectedBook] = useState(bibliaRV1960[0].archivo);
  const [selectedChapter, setSelectedChapter] = useState(1); // Estado para el capítulo

  const bookContent = bibliaContent[selectedBook as keyof typeof bibliaContent] || [];
  const chapterContent = bookContent[selectedChapter - 1] || []; // Contenido del capítulo
  const scrollViewRef = useRef<ScrollView>(null);

  const handleChapterChange = (chapter: number) => {
    setSelectedChapter(chapter);
    scrollViewRef.current?.scrollTo({
      x: (chapter - 1) * ITEM_WIDTH,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <Picker 
        selectedValue={selectedBook}
        style={styles.picker}
        onValueChange={(itemValue) => {
          setSelectedBook(itemValue);
          setSelectedChapter(1); 
        }}
      >
        {bibliaRV1960.map((book) => (
          <Picker.Item key={book.archivo} label={book.nombre} value={book.archivo} />
        ))}
      </Picker>

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
          <TouchableOpacity // Usar TouchableOpacity para detectar toques
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
          <View key={index} style={styles.verse}>
            <Text style={styles.verseNumber}>{index + 1}</Text>
            <Text style={styles.verseText}>{verse}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
const ITEM_WIDTH = 80; // Ancho de cada elemento en el ScrollView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  content: {
    fontSize: 16,
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
    maxHeight: 50,
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
});
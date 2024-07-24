import React, { useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { bibliaContent } from '@/constants/bibliaContent';
import useAppStore from '@/store/store';
import { useFonts, Lora_400Regular, Lora_700Bold } from '@expo-google-fonts/lora';
import { useTheme } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Chapter = string[];

const getColors = (theme: 'light' | 'dark') => ({
  background: theme === 'light' ? '#FFF8E1' : '#1A1A1A',
  card: theme === 'light' ? '#F2E8C9' : '#2C2C2C',
});

export default function Bible() {
  const [fontsLoaded] = useFonts({
    Lora_400Regular,
    Lora_700Bold,
  });

  const { 
    selectedBook, 
    selectedChapter, 
    favoriteVerses, 
    setSelectedChapter, 
    toggleFavoriteVerse,
    setTextToRead // Add this to useAppStore
  } = useAppStore();

  const { colors, dark } = useTheme();
  const customColors = getColors(dark ? 'dark' : 'light');

  const bookContent = bibliaContent[selectedBook as keyof typeof bibliaContent] || [];

  const handleChapterChange = useCallback((chapter: number) => {
    setSelectedChapter(chapter);
  }, [setSelectedChapter]);

  const renderVerse = useCallback(({ item: verse, index: verseIndex }: { item: string, index: number }) => (
    <TouchableOpacity onPress={() => toggleFavoriteVerse(verse)}>
      <View style={[styles.verse, favoriteVerses.includes(verse) && { backgroundColor: colors.notification }]}>
        <Text style={[styles.verseNumber, { color: colors.text }]}>{verseIndex + 1}</Text>
        <Text style={[styles.verseText, { color: colors.text }]}>{verse}</Text>
      </View>
    </TouchableOpacity>
  ), [favoriteVerses, toggleFavoriteVerse, colors]);

  if (!fontsLoaded) {
    return null;
  }

  const handleReadText = () => {
    const text = bookContent[selectedChapter - 1].join(' ');
    setTextToRead(text); // Set the text to be read
  };

  return (
    <View style={[styles.container, { backgroundColor: customColors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.chapterPickerContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chapterPicker}
            contentContainerStyle={styles.chapterPickerContent}
          >
            {bookContent.map((_, index) => (
              <TouchableOpacity
                key={index + 1}
                style={[
                  styles.chapterItem,
                  selectedChapter === index + 1 && [styles.selectedChapterItem, { borderBottomColor: colors.primary }],
                ]}
                onPress={() => handleChapterChange(index + 1)}
              >
                <Text style={[styles.chapterText, { color: colors.text }]}>{index + 1}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.contentContainerWrapper}>
          <View style={[styles.contentContainerBeforeAfter, styles.contentContainerBefore, { backgroundColor: customColors.card }]} />
          <View style={[styles.contentContainerBeforeAfter, styles.contentContainerAfter, { backgroundColor: customColors.card }]} />
          <FlatList
            style={styles.chapterContainer}
            contentContainerStyle={[styles.chapterContentContainer, { 
              backgroundColor: customColors.card,
              borderColor: colors.border,
            }]}
            data={bookContent[selectedChapter - 1]}
            renderItem={renderVerse}
            keyExtractor={(_, index) => `verse-${index}`}
          />
        </View>

        {/* Add Button to Read Text */}
        <TouchableOpacity style={styles.readButton} onPress={handleReadText}>
          <Text style={styles.readButtonText}>Leer Texto</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  safeArea: {
    flex: 1,
  },
  chapterPickerContainer: {
    height: '10%',
    justifyContent: 'center',
  },
  chapterPicker: {
    maxHeight: 40,
  },
  chapterPickerContent: {
    paddingHorizontal: 10,
  },
  contentContainerWrapper: {
    flex: 1,
    marginHorizontal: '2%',
    marginVertical: '2%',
    overflow: 'hidden',
  },
  chapterContainer: {
    flex: 1,
    width: SCREEN_WIDTH * 0.96,
  },
  chapterContentContainer: {
    padding: '5%',
    paddingBottom: '10%',
    borderRadius: 8,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  contentContainerBeforeAfter: {
    position: 'absolute',
    left: '2%',
    right: '2%',
    height: 10,
  },
  contentContainerBefore: {
    top: -5,
    transform: [{ rotate: '1deg' }],
  },
  contentContainerAfter: {
    bottom: -5,
    transform: [{ rotate: '-1deg' }],
  },
  verse: {
    flexDirection: 'row',
    marginBottom: '2%',
  },
  verseNumber: {
    fontWeight: 'bold',
    marginRight: '2%',
    fontFamily: 'Lora_700Bold',
  },
  verseText: {
    flex: 1,
    fontFamily: 'Lora_400Regular',
  },
  chapterItem: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  chapterText: {
    fontFamily: 'Lora_700Bold',
  },
  selectedChapterItem: {
    borderBottomWidth: 2,
  },
  readButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
  },
  readButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

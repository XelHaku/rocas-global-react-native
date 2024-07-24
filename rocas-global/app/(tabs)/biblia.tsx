import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, ScrollView, ViewToken, SafeAreaView } from 'react-native';
import { bibliaContent } from '@/constants/bibliaContent';
import useAppStore from '@/store/store';
import { useFonts, Lora_400Regular, Lora_700Bold } from '@expo-google-fonts/lora';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type Chapter = string[];

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
    toggleFavoriteVerse 
  } = useAppStore();
  const flatListRef = useRef<FlatList<Chapter>>(null);

  const bookContent = bibliaContent[selectedBook as keyof typeof bibliaContent] || [];

  const handleChapterChange = useCallback((chapter: number) => {
    setSelectedChapter(chapter);
    flatListRef.current?.scrollToIndex({ index: chapter - 1, animated: true });
  }, [setSelectedChapter]);

  const renderChapter = useCallback(({ item: chapter }: { item: Chapter }) => (
    <ScrollView 
      style={styles.chapterContainer}
      contentContainerStyle={styles.chapterContentContainer}
    >
      {chapter.map((verse, verseIndex) => (
        <TouchableOpacity key={verseIndex} onPress={() => toggleFavoriteVerse(verse)}>
          <View style={[styles.verse, favoriteVerses.includes(verse) && styles.favoriteVerse]}>
            <Text style={styles.verseNumber}>{verseIndex + 1}</Text>
            <Text style={styles.verseText}>{verse}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  ), [favoriteVerses, toggleFavoriteVerse]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setSelectedChapter(viewableItems[0].index! + 1);
    }
  }, [setSelectedChapter]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
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
                selectedChapter === index + 1 && styles.selectedChapterItem,
              ]}
              onPress={() => handleChapterChange(index + 1)}
            >
              <Text style={styles.chapterText}>{index + 1}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.contentContainerWrapper}>
        <View style={[styles.contentContainerBeforeAfter, styles.contentContainerBefore]} />
        <View style={[styles.contentContainerBeforeAfter, styles.contentContainerAfter]} />
        <FlatList
          ref={flatListRef}
          data={bookContent}
          renderItem={renderChapter}
          keyExtractor={(_, index) => `chapter-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          initialScrollIndex={selectedChapter - 1}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
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
    width: SCREEN_WIDTH * 0.96, // 96% del ancho de la pantalla
    height: '100%',
  },
  chapterContentContainer: {
    padding: '5%',
    backgroundColor: '#F2E8C9',
    paddingBottom: '10%',
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#D3B88C',
    borderStyle: 'solid',
  },
  contentContainerBeforeAfter: {
    position: 'absolute',
    left: '2%',
    right: '2%',
    height: 10,
    backgroundColor: '#F2E8C9',
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
    color: '#6D4C41',
  },
  verseText: {
    flex: 1,
    fontFamily: 'Lora_400Regular',
    color: '#795548',
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
    color: '#8D6E63',
  },
  selectedChapterItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#4E342E',
  },
  favoriteVerse: {
    backgroundColor: '#D7CCC8',
  },
});
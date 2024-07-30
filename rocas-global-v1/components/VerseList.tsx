import React from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import useAppStore from '@/store/store';
import { styles } from '@/constants/styles';

export default function VerseList({ bookContent, selectedChapter, customColors, colors }) {
  const { favoriteVerses, toggleFavoriteVerse } = useAppStore();

  const renderVerse = ({ item: verse, index: verseIndex }) => (
    <TouchableOpacity onPress={() => toggleFavoriteVerse(verse)}>
      <View style={[styles.verse, favoriteVerses.includes(verse) && { backgroundColor: colors.notification }]}>
        <Text style={[styles.verseNumber, { color: colors.text }]}>{verseIndex + 1}</Text>
        <Text style={[styles.verseText, { color: colors.text }]}>{verse.replace(/\/n/g, ' ').trim()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
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
  );
}
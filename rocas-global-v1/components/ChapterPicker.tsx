import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { styles } from '@/constants/styles';

export default function ChapterPicker({ bookContent, selectedChapter, handleChapterChange, colors }) {
  return (
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
  );
}
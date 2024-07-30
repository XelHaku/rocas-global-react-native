import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { styles } from '@/constants/styles';

export default function NavigationButtons({ goToPreviousChapter, goToNextChapter }) {
  return (
    <>
      <TouchableOpacity 
        style={[styles.floatingButton, styles.floatingButtonLeft]}
        onPress={goToPreviousChapter}
      >
        <FontAwesome name="chevron-left" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.floatingButton, styles.floatingButtonRight]}
        onPress={goToNextChapter}
      >
        <FontAwesome name="chevron-right" size={24} color="white" />
      </TouchableOpacity>
    </>
  );
}
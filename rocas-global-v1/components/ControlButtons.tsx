import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { styles } from '@/constants/styles';

export default function ControlButtons({ isPlaying, isPaused, handleReadText, stopSpeech, restartSpeech }) {
  return (
    <View style={styles.controlButtonsContainer}>
      <TouchableOpacity style={styles.controlButton} onPress={handleReadText}>
        <FontAwesome name={isPlaying ? (isPaused ? "play" : "pause") : "play"} size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.controlButton} onPress={stopSpeech}>
        <FontAwesome name="stop" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.controlButton} onPress={restartSpeech}>
        <FontAwesome name="refresh" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}
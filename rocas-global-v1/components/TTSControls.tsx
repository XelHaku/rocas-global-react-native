// components/TTSControls.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTTS } from '@/hooks/useTTS';

interface TTSControlsProps {
  text: string;
}

const TTSControls: React.FC<TTSControlsProps> = ({ text }) => {
  const { startSpeech, stopSpeech, isPlaying } = useTTS();

  const handlePlayStop = () => {
    if (isPlaying) {
      stopSpeech();
    } else {
      startSpeech(text);
    }
  };

  const handleRestart = () => {
    stopSpeech();
    startSpeech(text);
  };

  return (
    <View style={styles.controlButtonsContainer}>
      <TouchableOpacity 
        style={styles.controlButton}
        onPress={handlePlayStop}
      >
        <FontAwesome 
          name={isPlaying ? "stop" : "play"} 
          size={20} 
          color="white" 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.controlButton}
        onPress={handleRestart}
      >
        <FontAwesome name="refresh" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -50 }],
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  controlButton: {
    backgroundColor: 'rgba(60, 70, 85, 0.3)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
  },
});

export default TTSControls;
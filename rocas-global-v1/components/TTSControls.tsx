// components/TTSControls.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTTS } from '@/hooks/useTTS';

interface TTSControlsProps {
  text: string;
}

const TTSControls: React.FC<TTSControlsProps> = ({ text }) => {
  const { startSpeech, stopSpeech, isPlaying } = useTTS();
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];

  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
    }).start();
    setIsExpanded(!isExpanded);
  };

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

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.speakerButton}
        onPress={toggleExpand}
      >
        <FontAwesome5 name="volume-up" size={20} color="#D4AF37" />
      </TouchableOpacity>
      <Animated.View style={[styles.controlButtonsContainer, { transform: [{ translateX }] }]}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={handlePlayStop}
        >
          <FontAwesome5 
            name={isPlaying ? "stop" : "play"} 
            size={20} 
            color="#D4AF37" 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={handleRestart}
        >
          <FontAwesome5 name="redo" size={20} color="#D4AF37" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerButton: {
    backgroundColor: 'rgba(244, 233, 209, 0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  controlButtonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  controlButton: {
    backgroundColor: 'rgba(244, 233, 209, 0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});

export default TTSControls;
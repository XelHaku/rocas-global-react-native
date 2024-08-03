// components/TTSControls.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTTS } from '@/hooks/useTTS';

interface TTSControlsProps {
  text: string;
  style?: object;
}

const TTSControls: React.FC<TTSControlsProps> = ({ text, style }) => {
  const { startSpeech, stopSpeech, isPlaying } = useTTS();
  const [isExpanded, setIsExpanded] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(fadeAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
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

  return (
    <View style={[styles.container, style]}>
      <Animated.View 
        style={[
          styles.controlButtonsContainer, 
          { 
            opacity: fadeAnim,
            transform: [
              {
                translateX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0] // Ajusta estos valores según necesites
                })
              }
            ]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.button}
          onPress={handlePlayStop}
        >
          <FontAwesome5 
            name={isPlaying ? "stop" : "play"} 
            size={24} 
            color="#D4AF37" 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleRestart}
        >
          <FontAwesome5 name="redo" size={24} color="#D4AF37" />
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity 
        style={styles.button}
        onPress={toggleExpand}
      >
        <FontAwesome5 name="volume-up" size={24} color="#D4AF37" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    right: 50, // Ajusta este valor según sea necesario
  },
});

export default TTSControls;
import React, { useState, useEffect } from 'react';
import { StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import useAppStore from '@/store/store';
import { FontAwesome } from '@expo/vector-icons';
import Tts, { Voice } from 'react-native-tts';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

export default function TabTwoScreen() {
  const { theme, setTheme } = useAppStore();
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState(0.5);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isTtsInitialized, setIsTtsInitialized] = useState(false);
  const [textToRead, setTextToRead] = useState<string>(''); // Add this state

  useEffect(() => {
    const initTTS = async () => {
      try {
        await Tts.getInitStatus(); 
        const availableVoices = await Tts.voices();
        setVoices(availableVoices);
        setSelectedVoice(availableVoices[0]?.id || null);
        setIsTtsInitialized(true);
      } catch (error) {
        console.error("Error initializing TTS:", error);
      }
    };

    initTTS();
  }, []); 

  useEffect(() => {
    if (isTtsInitialized && Tts && selectedVoice) {
      Tts.setDefaultVoice(selectedVoice);
    }
  }, [isTtsInitialized, selectedVoice]);

  useEffect(() => {
    if (isTtsInitialized && Tts) {
      Tts.setDefaultRate(speechRate);
    }
  }, [isTtsInitialized, speechRate]);

  useEffect(() => {
    if (isTtsInitialized && Tts) {
      Tts.setDefaultPitch(speechPitch);
    }
  }, [isTtsInitialized, speechPitch]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleReadText = () => {
    if (isTtsInitialized && textToRead) {
      Tts.speak(textToRead);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      
      <View style={styles.themeContainer}>
        <FontAwesome name="sun-o" size={24} color={theme === 'light' ? '#f1c40f' : '#7f8c8d'} />
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={theme === 'light' ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleTheme}
          value={theme === 'dark'}
          style={styles.switch}
        />
        <FontAwesome name="moon-o" size={24} color={theme === 'dark' ? '#f1c40f' : '#7f8c8d'} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Tema actual: {theme === 'light' ? 'Claro' : 'Oscuro'}</Text>
      </View>
      
      {/* Add Button to Read Text */}
      <TouchableOpacity style={styles.button} onPress={handleReadText}>
        <Text style={styles.buttonText}>Reproducir Texto</Text>
      </TouchableOpacity>

      <View style={styles.settingsContainer}>
        <Text style={styles.settingsTitle}>Configuración de Lectura:</Text>

        <View style={styles.settingItem}>
          <Text style={styles.label}>Voz:</Text>
          <Picker
            selectedValue={selectedVoice}
            onValueChange={setSelectedVoice}
            style={styles.picker}
          >
            {voices.map(voice => (
              <Picker.Item key={voice.id} label={voice.name || voice.id} value={voice.id} />
            ))}
          </Picker>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.label}>Velocidad:</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.1}
            maximumValue={1.0}
            step={0.1}
            value={speechRate}
            onValueChange={setSpeechRate}
            thumbTintColor={theme === 'light' ? "#f5dd4b" : "#f4f3f4"}
            minimumTrackTintColor="#2196F3"
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.label}>Tono:</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2.0}
            step={0.1}
            value={speechPitch}
            onValueChange={setSpeechPitch}
            thumbTintColor={theme === 'light' ? "#f5dd4b" : "#f4f3f4"}
            minimumTrackTintColor="#2196F3"
          />
        </View>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  themeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switch: {
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  infoContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoText: {
    fontSize: 16,
  },
  settingsContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingItem: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
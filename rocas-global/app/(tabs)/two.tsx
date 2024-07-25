import React, { useState, useEffect } from 'react';
import { StyleSheet, Switch, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import useAppStore from '@/store/store';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

const Tts = Platform.OS !== 'web' ? require('react-native-tts').default : null;

interface Voice {
  id: string;
  name: string;
}

export default function TabTwoScreen() {
  const { theme, setTheme, ttsConfig, setTtsConfig } = useAppStore();
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isTtsInitialized, setIsTtsInitialized] = useState<boolean>(false);
  const [textToRead, setTextToRead] = useState<string>('');

  useEffect(() => {
    const initTTS = async () => {
      if (Platform.OS === 'web') {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.onvoiceschanged = () => {
            const webVoices = window.speechSynthesis.getVoices();
            const processedVoices = webVoices.map((voice, index) => ({
              id: `web-voice-${index}`,
              name: voice.name
            }));
            setVoices(processedVoices);
            if (processedVoices.length > 0 && !ttsConfig.selectedVoice) {
              setTtsConfig({ selectedVoice: processedVoices[0].id });
            }
            setIsTtsInitialized(true);
          };
        } else {
          console.error("Web Speech API not supported");
        }
      } else if (Tts) {
        try {
          await Tts.getInitStatus();
          const availableVoices = await Tts.voices();
          const processedVoices = availableVoices.map((voice: any) => ({
            id: voice.id || voice.identifier || `voice-${Math.random()}`,
            name: voice.name || voice.language || 'Voz sin nombre'
          }));
          setVoices(processedVoices);
          if (processedVoices.length > 0 && !ttsConfig.selectedVoice) {
            setTtsConfig({ selectedVoice: processedVoices[0].id });
          }
          setIsTtsInitialized(true);
        } catch (error) {
          console.error("Error initializing TTS:", error);
        }
      }
    };

    initTTS();
  }, []);

  useEffect(() => {
    if (isTtsInitialized && ttsConfig.selectedVoice && Platform.OS !== 'web' && Tts) {
      Tts.setDefaultVoice(ttsConfig.selectedVoice);
      Tts.setDefaultRate(ttsConfig.speechRate);
      Tts.setDefaultPitch(ttsConfig.speechPitch);
    }
  }, [isTtsInitialized, ttsConfig]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleReadText = () => {
    if (isTtsInitialized && textToRead) {
      if (Platform.OS === 'web') {
        const utterance = new SpeechSynthesisUtterance(textToRead);
        const selectedWebVoice = window.speechSynthesis.getVoices().find(
          (voice, index) => `web-voice-${index}` === ttsConfig.selectedVoice
        );
        if (selectedWebVoice) {
          utterance.voice = selectedWebVoice;
        }
        utterance.rate = ttsConfig.speechRate;
        utterance.pitch = ttsConfig.speechPitch;
        window.speechSynthesis.speak(utterance);
      } else if (Tts) {
        Tts.speak(textToRead);
      }
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

      <View style={styles.ttsContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ingrese texto para leer"
          value={textToRead}
          onChangeText={setTextToRead}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleReadText}>
          <Text style={styles.buttonText}>Reproducir Texto</Text>
        </TouchableOpacity>

        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Configuración de Lectura:</Text>

          <View style={styles.settingItem}>
            <Text style={styles.label}>Voz:</Text>
            <Picker
              selectedValue={ttsConfig.selectedVoice}
              onValueChange={(itemValue: string) => setTtsConfig({ selectedVoice: itemValue })}
              style={styles.picker}
            >
              {voices.map((voice) => (
                <Picker.Item key={voice.id} label={voice.name} value={voice.id} />
              ))}
            </Picker>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.label}>Velocidad: {ttsConfig.speechRate.toFixed(1)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={1.0}
              step={0.1}
              value={ttsConfig.speechRate}
              onValueChange={(value) => setTtsConfig({ speechRate: value })}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.label}>Tono: {ttsConfig.speechPitch.toFixed(1)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.0}
              step={0.1}
              value={ttsConfig.speechPitch}
              onValueChange={(value) => setTtsConfig({ speechPitch: value })}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  ttsContainer: {
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    minHeight: 100,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  settingsContainer: {
    marginTop: 20,
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
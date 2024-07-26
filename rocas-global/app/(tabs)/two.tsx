import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Platform, Button, Alert, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import useAppStore from '@/store/store';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';

const Tts = Platform.OS !== 'web' ? require('react-native-tts').default : null;

interface TtsVoice {
  id: string;
  name: string;
  language: string;
}

export default function TabTwoScreen() {
  const { 
    theme, 
    setTheme, 
    ttsConfig, 
    setTtsConfig, 
    setSpeechRate, 
    setSpeechPitch,
  } = useAppStore();

  const [availableVoices, setAvailableVoices] = useState<TtsVoice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');

  useEffect(() => {
    const initTTS = async () => {
      if (Platform.OS !== 'web' && Tts) {
        try {
          await Tts.getInitStatus();
          const voices: TtsVoice[] = await Tts.voices();
          console.log('Todas las voces disponibles:', voices);
          
          const spanishVoices = voices.filter(voice => 
            voice.language.startsWith('es')
          );
          console.log('Voces en español:', spanishVoices);
          
          setAvailableVoices(spanishVoices);
          
          if (spanishVoices.length > 0) {
            const defaultVoice = spanishVoices[0];
            setSelectedVoiceId(defaultVoice.id);
            await Tts.setDefaultVoice(defaultVoice.id);
            setTtsConfig({ selectedVoice: defaultVoice.name });
            console.log('Voz predeterminada seleccionada:', defaultVoice);
          } else {
            console.log('No se encontraron voces en español');
            Alert.alert(
              "Advertencia",
              "No se encontraron voces en español. Por favor, instala voces en español en la configuración de tu dispositivo."
            );
          }
          
          await Tts.setDefaultLanguage('es-MX');
          await Tts.setDefaultRate(ttsConfig.speechRate);
          await Tts.setDefaultPitch(ttsConfig.speechPitch);
          console.log('TTS configurado: español, velocidad', ttsConfig.speechRate, ', tono', ttsConfig.speechPitch);
        } catch (error) {
          console.error("Error al inicializar TTS:", error);
          Alert.alert("Error", "No se pudo inicializar el sistema de voz. Por favor, verifica la configuración de tu dispositivo.");
        }
      }
    };

    initTTS();
  }, []);

  useEffect(() => {
    if (Tts) {
      Tts.setDefaultRate(ttsConfig.speechRate);
      Tts.setDefaultPitch(ttsConfig.speechPitch);
    }
  }, [ttsConfig.speechRate, ttsConfig.speechPitch]);

  const selectVoice = async (voiceId: string) => {
    setSelectedVoiceId(voiceId);
    if (Tts) {
      try {
        await Tts.setDefaultVoice(voiceId);
        const selectedVoice = availableVoices.find(v => v.id === voiceId);
        if (selectedVoice) {
          setTtsConfig({ selectedVoice: selectedVoice.name });
          console.log('Voz seleccionada:', selectedVoice.name);
        }
      } catch (error) {
        console.error("Error al seleccionar la voz:", error);
        Alert.alert("Error", "No se pudo seleccionar la voz.");
      }
    }
  };

  const testVoice = () => {
    if (Tts && selectedVoiceId) {
      Tts.speak('Esta es una prueba de la voz seleccionada.');
    } else {
      Alert.alert("Error", "Por favor, selecciona una voz primero.");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
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
        <Text style={styles.sectionTitle}>Configuración de Lectura</Text>
        
        <Text style={styles.sectionSubtitle}>Seleccionar voz:</Text>
        {availableVoices.length > 0 ? (
          <RNView style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedVoiceId}
              onValueChange={(itemValue) => selectVoice(itemValue)}
              style={styles.picker}
            >
              {availableVoices.map((voice) => (
                <Picker.Item key={voice.id} label={voice.name} value={voice.id} />
              ))}
            </Picker>
          </RNView>
        ) : (
          <Text style={styles.noVoicesText}>No se encontraron voces en español. Por favor, instala voces en español en la configuración de tu dispositivo.</Text>
        )}

        <Button 
          title="Probar voz seleccionada" 
          onPress={testVoice}
          disabled={availableVoices.length === 0}
        />

        <Text style={styles.sectionSubtitle}>Velocidad: {ttsConfig.speechRate.toFixed(2)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0.1}
          maximumValue={2}
          value={ttsConfig.speechRate}
          onValueChange={setSpeechRate}
        />

        <Text style={styles.sectionSubtitle}>Tono: {ttsConfig.speechPitch.toFixed(2)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0.5}
          maximumValue={2}
          value={ttsConfig.speechPitch}
          onValueChange={setSpeechPitch}
        />
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
  infoContainer: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  noVoicesText: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 10,
  },
});
import React, { useEffect } from 'react';
import { StyleSheet, Switch, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import useAppStore from '@/store/store';
import { FontAwesome } from '@expo/vector-icons';

const Tts = Platform.OS !== 'web' ? require('react-native-tts').default : null;

export default function TabTwoScreen() {
  const { theme, setTheme } = useAppStore();

  useEffect(() => {
    const initTTS = async () => {
      if (Platform.OS === 'web') {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.onvoiceschanged = () => {
            const voices = window.speechSynthesis.getVoices();
            const spanishVoice = voices.find(voice => 
              voice.lang.startsWith('es') && voice.name.toLowerCase().includes('MX')
            );
            if (spanishVoice) {
              console.log('Voz en español de México configurada:', spanishVoice.name);
            } else {
              console.log('No se encontró una voz en español de México');
            }
          };
        } else {
          console.error("Web Speech API no soportada");
        }
      } else if (Tts) {
        try {
          await Tts.getInitStatus();
          await Tts.setDefaultLanguage('es-MX');
          await Tts.setDefaultRate(0.8);
          await Tts.setDefaultPitch(1);
          console.log('TTS configurado: español MX, velocidad 0.8, tono 0.35');
        } catch (error) {
          console.error("Error al inicializar TTS:", error);
        }
      }
    };

    initTTS();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    console.log('Tema cambiado a:', newTheme);
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
        <Text style={styles.infoText}>Configuración de Lectura:</Text>
        <Text style={styles.infoText}>Voz: Español (México)</Text>
        <Text style={styles.infoText}>Velocidad: 0.8</Text>
        <Text style={styles.infoText}>Tono: 0.35</Text>
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
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
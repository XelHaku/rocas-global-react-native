import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import useAppStore from '../store/store';

export default function Biblia() {
  const { theme, setTheme } = useAppStore();

  useEffect(() => {
    console.log('Biblia: Tema actual', theme);
  }, [theme]);

  const isDarkTheme = theme === 'dark';

  const toggleTheme = () => {
    console.log('Biblia: Intentando cambiar el tema');
    setTheme(isDarkTheme ? 'light' : 'dark');
  };

  return (
    <View
      style={[
        styles.container,
        isDarkTheme
          ? { backgroundColor: 'black' }
          : { backgroundColor: 'white' },
      ]}
    >
      <Text style={[styles.text, isDarkTheme ? { color: 'white' } : { color: 'black' }]}>
        This is demo of default dark/light theme using appearance.{' '}
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          isDarkTheme
            ? { backgroundColor: 'white' }
            : { backgroundColor: 'black' },
        ]}
        onPress={toggleTheme}
      >
        <Text style={[styles.buttonText, { color: isDarkTheme ? 'black' : 'white' }]}>
          Cambiar tema
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
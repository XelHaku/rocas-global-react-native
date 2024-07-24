import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Tts from 'react-native-tts';
import useAppStore from '@/store/store';

export default function TextReader() {
  const { textToRead } = useAppStore();

  useEffect(() => {
    if (textToRead) {
      Tts.speak(textToRead);
    }
  }, [textToRead]);

}

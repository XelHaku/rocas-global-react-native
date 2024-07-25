import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { bibliaContent } from '@/constants/bibliaContent';
import useAppStore from '@/store/store';
import { useFonts, Lora_400Regular, Lora_700Bold } from '@expo-google-fonts/lora';
import { useTheme } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

let Tts: any;
if (Platform.OS !== 'web') {
  Tts = require('react-native-tts').default;
}

const getColors = (theme: 'light' | 'dark') => ({
  background: theme === 'light' ? '#FFF8E1' : '#1A1A1A',
  card: theme === 'light' ? '#F2E8C9' : '#2C2C2C',
});

export default function Bible() {
  const [fontsLoaded] = useFonts({
    Lora_400Regular,
    Lora_700Bold,
  });

  const { 
    selectedBook, 
    selectedChapter, 
    favoriteVerses, 
    setSelectedChapter, 
    toggleFavoriteVerse,
    setTextToRead,
    theme: appTheme,
    ttsConfig,
  } = useAppStore();

  const [ttsAvailable, setTtsAvailable] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const { colors } = useTheme();
  const customColors = getColors(appTheme);

  const bookContent = bibliaContent[selectedBook as keyof typeof bibliaContent] || [];

  useEffect(() => {
    const initTts = async () => {
      if (Platform.OS === 'web') {
        setTtsAvailable('speechSynthesis' in window);
      } else if (Tts) {
        try {
          await Tts.getInitStatus();
          await Tts.setDefaultLanguage('es-ES');
          setTtsAvailable(true);
        } catch (err) {
          console.error('Error initializing TTS:', err);
          setTtsAvailable(false);
        }
      }
    };

    initTts();

    return () => {
      stopSpeech();
    };
  }, []);

  const handleChapterChange = useCallback((chapter: number) => {
    setSelectedChapter(chapter);
  }, [setSelectedChapter]);

  const renderVerse = useCallback(({ item: verse, index: verseIndex }: { item: string, index: number }) => (
    <TouchableOpacity onPress={() => toggleFavoriteVerse(verse)}>
      <View style={[styles.verse, favoriteVerses.includes(verse) && { backgroundColor: colors.notification }]}>
        <Text style={[styles.verseNumber, { color: colors.text }]}>{verseIndex + 1}</Text>
        <Text style={[styles.verseText, { color: colors.text }]}>{verse}</Text>
      </View>
    </TouchableOpacity>
  ), [favoriteVerses, toggleFavoriteVerse, colors]);

  if (!fontsLoaded) {
    return null;
  }

  const startSpeech = (text: string) => {
    if (Platform.OS === 'web') {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        const selectedWebVoice = window.speechSynthesis.getVoices().find(
          (voice, index) => `web-voice-${index}` === ttsConfig.selectedVoice
        );
        if (selectedWebVoice) {
          utterance.voice = selectedWebVoice;
        }
        utterance.rate = ttsConfig.speechRate;
        utterance.pitch = ttsConfig.speechPitch;
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      } else {
        console.log('Web Speech API is not supported in this browser');
        alert('La síntesis de voz no está disponible en este navegador');
      }
    } else if (ttsAvailable && Tts) {
      Tts.speak(text, {
        androidParams: {
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
          KEY_PARAM_VOLUME: 1,
          KEY_PARAM_PAN: 0,
        },
      });
      setIsPlaying(true);
      Tts.addEventListener('tts-finish', () => setIsPlaying(false));
    } else {
      console.log('TTS is not available on this platform');
      alert('La síntesis de voz no está disponible en esta plataforma');
    }
  };

  const stopSpeech = () => {
    if (Platform.OS === 'web') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else if (Tts) {
      Tts.stop();
    }
    setIsPlaying(false);
  };

  const handleReadText = () => {
    if (isPlaying) {
      stopSpeech();
    } else {
      const text = bookContent[selectedChapter - 1].join('. ');
      setTextToRead(text);
      startSpeech(text);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: customColors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.chapterPickerContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chapterPicker}
            contentContainerStyle={styles.chapterPickerContent}
          >
            {bookContent.map((_, index) => (
              <TouchableOpacity
                key={index + 1}
                style={[
                  styles.chapterItem,
                  selectedChapter === index + 1 && [styles.selectedChapterItem, { borderBottomColor: colors.primary }],
                ]}
                onPress={() => handleChapterChange(index + 1)}
              >
                <Text style={[styles.chapterText, { color: colors.text }]}>{index + 1}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.contentContainerWrapper}>
          <View style={[styles.contentContainerBeforeAfter, styles.contentContainerBefore, { backgroundColor: customColors.card }]} />
          <View style={[styles.contentContainerBeforeAfter, styles.contentContainerAfter, { backgroundColor: customColors.card }]} />
          <FlatList
            style={styles.chapterContainer}
            contentContainerStyle={[styles.chapterContentContainer, { 
              backgroundColor: customColors.card,
              borderColor: colors.border,
            }]}
            data={bookContent[selectedChapter - 1]}
            renderItem={renderVerse}
            keyExtractor={(_, index) => `verse-${index}`}
          />
        </View>

        <TouchableOpacity 
          style={[styles.readButton, isPlaying && styles.stopButton]}
          onPress={handleReadText}
        >
          <Text style={styles.readButtonText}>
            {isPlaying ? 'Detener' : 'Leer Texto'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  safeArea: {
    flex: 1,
  },
  chapterPickerContainer: {
    height: '10%',
    justifyContent: 'center',
  },
  chapterPicker: {
    maxHeight: 40,
  },
  chapterPickerContent: {
    paddingHorizontal: 10,
  },
  contentContainerWrapper: {
    flex: 1,
    marginHorizontal: '2%',
    marginVertical: '2%',
    overflow: 'hidden',
  },
  chapterContainer: {
    flex: 1,
    width: SCREEN_WIDTH * 0.96,
  },
  chapterContentContainer: {
    padding: '5%',
    paddingBottom: '10%',
    borderRadius: 8,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  contentContainerBeforeAfter: {
    position: 'absolute',
    left: '2%',
    right: '2%',
    height: 10,
  },
  contentContainerBefore: {
    top: -5,
    transform: [{ rotate: '1deg' }],
  },
  contentContainerAfter: {
    bottom: -5,
    transform: [{ rotate: '-1deg' }],
  },
  verse: {
    flexDirection: 'row',
    marginBottom: '2%',
  },
  verseNumber: {
    fontWeight: 'bold',
    marginRight: '2%',
    fontFamily: 'Lora_700Bold',
  },
  verseText: {
    flex: 1,
    fontFamily: 'Lora_400Regular',
  },
  chapterItem: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  chapterText: {
    fontFamily: 'Lora_700Bold',
  },
  selectedChapterItem: {
    borderBottomWidth: 2,
  },
  readButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
  },
  stopButton: {
    backgroundColor: '#DC3545',
  },
  readButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
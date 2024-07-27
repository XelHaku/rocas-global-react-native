import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, ScrollView, SafeAreaView, Platform, StatusBar, Animated } from 'react-native';
import { bibliaContent } from '@/constants/bibliaContent';
import useAppStore from '@/store/store';
import { useFonts, Lora_400Regular, Lora_700Bold } from '@expo-google-fonts/lora';
import { useTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

let Tts: any;
if (Platform.OS !== 'web') {
  Tts = require('react-native-tts').default;
}

type TTSEvent = number;

const getColors = (theme: 'light' | 'dark') => ({
  background: theme === 'light' ? '#FFFFFF' : '#121212',
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
    setSelectedBook,
    toggleFavoriteVerse,
    setTextToRead,
    theme: appTheme,
    ttsConfig,
    isPlaying,
    setIsPlaying,
    isPaused,
    setIsPaused
  } = useAppStore();

  const [ttsAvailable, setTtsAvailable] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  const { colors } = useTheme();
  const customColors = getColors(appTheme);

  const bookContent = bibliaContent[selectedBook as keyof typeof bibliaContent] || [];

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const processText = (text: string) => {
    return text.replace(/\/n/g, ' ').trim();
  };
  
  const getBookName = (bookName: string) => {
    return bookName.replace('.json', '').replace(/_/g, ' ');
  };

  const startSpeech = useCallback((text: string) => {
    const processedText = processText(text);
    const bookName = getBookName(selectedBook);
    const introText = `Libro ${bookName}, capítulo ${selectedChapter}. `;
    const fullText = introText + processedText;
    
    if (Platform.OS === 'web') {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = 'es-MX';
        utterance.rate = ttsConfig.speechRate;
        utterance.pitch = ttsConfig.speechPitch;
        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
        };
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        setIsPaused(false);
      } else {
        console.log('Web Speech API is not supported in this browser');
        alert('La síntesis de voz no está disponible en este navegador');
      }
    } else if (ttsAvailable && Tts) {
      Tts.speak(fullText, {
        androidParams: {
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
          KEY_PARAM_VOLUME: 1,
          KEY_PARAM_PAN: 0,
        },
        rate: ttsConfig.speechRate,
        pitch: ttsConfig.speechPitch,
      });
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentPosition(0);
      Tts.addEventListener('tts-finish', () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentPosition(0);
      });
    } else {
      console.log('TTS is not available on this platform');
      alert('La síntesis de voz no está disponible en esta plataforma');
    }
  }, [selectedBook, selectedChapter, ttsConfig, ttsAvailable, setIsPlaying, setIsPaused]);

  const pauseSpeech = useCallback(() => {
    if (Platform.OS === 'web') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
    } else if (Tts) {
      Tts.stop();
      Tts.getCurrentPosition((position: TTSEvent) => {
        setCurrentPosition(position);
      });
    }
    setIsPaused(true);
  }, [setIsPaused]);

  const resumeSpeech = useCallback(() => {
    if (Platform.OS === 'web') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
    } else if (Tts) {
      const text = bookContent[selectedChapter - 1].join('. ');
      const processedText = processText(text);
      const bookName = getBookName(selectedBook);
      const introText = `Libro ${bookName}, capítulo ${selectedChapter}. `;
      const fullText = introText + processedText;
      
      Tts.speak(fullText.substring(currentPosition), {
        androidParams: {
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
          KEY_PARAM_VOLUME: 1,
          KEY_PARAM_PAN: 0,
        },
        rate: ttsConfig.speechRate,
        pitch: ttsConfig.speechPitch,
      });
    }
    setIsPaused(false);
  }, [setIsPaused, currentPosition, bookContent, selectedChapter, selectedBook, ttsConfig]);

  const stopSpeech = useCallback(() => {
    if (Platform.OS === 'web') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else if (Tts) {
      Tts.stop();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentPosition(0);
  }, [setIsPlaying, setIsPaused]);

  const restartSpeech = useCallback(() => {
    stopSpeech();
    const text = bookContent[selectedChapter - 1].join('. ');
    const processedText = processText(text);
    setTextToRead(processedText);
    startSpeech(processedText);
  }, [bookContent, selectedChapter, stopSpeech, setTextToRead, startSpeech]);

  const handleReadText = useCallback(() => {
    if (isPlaying) {
      if (isPaused) {
        resumeSpeech();
      } else {
        pauseSpeech();
      }
    } else {
      restartSpeech();
    }
  }, [isPlaying, isPaused, resumeSpeech, pauseSpeech, restartSpeech]);

  const handleChapterChange = useCallback((chapter: number) => {
    stopSpeech();
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start(() => {
      setSelectedChapter(chapter);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false, 
      }).start();
    });
  }, [setSelectedChapter, fadeAnim, stopSpeech]);

  const goToNextChapter = useCallback(() => {
    if (selectedChapter < bookContent.length) {
      handleChapterChange(selectedChapter + 1);
    } else {
      const bookKeys = Object.keys(bibliaContent);
      const currentBookIndex = bookKeys.indexOf(selectedBook);
      if (currentBookIndex < bookKeys.length - 1) {
        const nextBook = bookKeys[currentBookIndex + 1];
        setSelectedBook(nextBook);
        handleChapterChange(1);
      } else {
        stopSpeech();
      }
    }
  }, [selectedChapter, selectedBook, bookContent.length, handleChapterChange, setSelectedBook, stopSpeech]);

  const goToPreviousChapter = useCallback(() => {
    if (selectedChapter > 1) {
      handleChapterChange(selectedChapter - 1);
    } else {
      const bookKeys = Object.keys(bibliaContent);
      const currentBookIndex = bookKeys.indexOf(selectedBook);
      if (currentBookIndex > 0) {
        const previousBook = bookKeys[currentBookIndex - 1];
        setSelectedBook(previousBook);
        const previousBookContent = bibliaContent[previousBook as keyof typeof bibliaContent] || [];
        handleChapterChange(previousBookContent.length);
      }
    }
  }, [selectedChapter, selectedBook, handleChapterChange, setSelectedBook]);

  useEffect(() => {
    const initTts = async () => {
      if (Platform.OS === 'web') {
        setTtsAvailable('speechSynthesis' in window);
      } else if (Tts) {
        try {
          await Tts.getInitStatus();
          await Tts.setDefaultLanguage('es-MX');
          await Tts.setDefaultRate(ttsConfig.speechRate);
          await Tts.setDefaultPitch(ttsConfig.speechPitch);
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
  }, [ttsConfig.speechRate, ttsConfig.speechPitch, stopSpeech]);

  const renderVerse = useCallback(({ item: verse, index: verseIndex }: { item: string, index: number }) => (
    <TouchableOpacity onPress={() => toggleFavoriteVerse(verse)}>
      <View style={[styles.verse, favoriteVerses.includes(verse) && { backgroundColor: colors.notification }]}>
        <Text style={[styles.verseNumber, { color: colors.text }]}>{verseIndex + 1}</Text>
        <Text style={[styles.verseText, { color: colors.text }]}>{processText(verse)}</Text>
      </View>
    </TouchableOpacity>
  ), [favoriteVerses, toggleFavoriteVerse, colors]);

  if (!fontsLoaded) {
    return null;
  }

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
          <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
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
          </Animated.View>
        </View>

        <TouchableOpacity 
          style={[styles.floatingButton, styles.floatingButtonLeft]}
          onPress={goToPreviousChapter}
        >
          <FontAwesome name="chevron-left" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.controlButtonsContainer}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleReadText}
          >
            <FontAwesome 
              name={isPlaying ? (isPaused ? "play" : "pause") : "play"} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={stopSpeech}
          >
            <FontAwesome name="stop" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={restartSpeech}
          >
            <FontAwesome name="refresh" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.floatingButton, styles.floatingButtonRight]}
          onPress={goToNextChapter}
        >
          <FontAwesome name="chevron-right" size={24} color="white" />
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
    height: '7%',
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
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(60, 70, 85, 0.3)',
    width: 50,
    height: 50,
    borderRadius: 25,
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
  floatingButtonLeft: {
    left: 20,
  },
  floatingButtonRight: {
    right: 20,
  },
  controlButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -75 }],
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 150,
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

import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, ScrollView, SafeAreaView, Platform, StatusBar, Animated, ImageBackground, Share, Clipboard, Alert } from 'react-native';
import { bibliaContent } from '@/constants/bibliaContent';
import useAppStore from '@/store/store';
import { useFonts, Lora_400Regular, Lora_700Bold } from '@expo-google-fonts/lora';
import { useTheme } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import TTSControls from '@/components/TTSControls';
import TextSettingsControl from '@/components/TextSettingsControl';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getColors = (theme: 'light' | 'dark') => ({
  background: theme === 'light' ? '#F4E9D1' : '#3C2F1B',
  card: theme === 'light' ? 'rgba(244, 233, 209, 0.9)' : 'rgba(60, 47, 27, 0.9)',
  text: theme === 'light' ? '#5C4033' : '#D2B48C',
  accent: theme === 'light' ? '#D4AF37' : '#FFD700',
});

const showOptions = (options: Array<{text: string, onPress: () => void}>) => {
  if (Platform.OS === 'web') {
    const optionTexts = options.map(option => option.text);
    const selectedIndex = window.prompt(`Seleccione una opción:\n${optionTexts.map((text, index) => `${index + 1}. ${text}`).join('\n')}`);
    if (selectedIndex !== null) {
      const index = parseInt(selectedIndex) - 1;
      if (index >= 0 && index < options.length) {
        options[index].onPress();
      }
    }
  } else {
    Alert.alert(
      "Opciones",
      "Seleccione una acción",
      options.map(option => ({
        text: option.text,
        onPress: option.onPress
      }))
    );
  }
};

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
    theme: appTheme,
  } = useAppStore();

  const { colors } = useTheme();
  const customColors = getColors(appTheme);

  const bookContent = bibliaContent[selectedBook as keyof typeof bibliaContent] || [];

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(28);
  const [isTextSettingsVisible, setIsTextSettingsVisible] = useState(false);

  const processText = useCallback((text: string) => {
    return text.replace(/\/n/g, ' ').trim();
  }, []);
  
  const getBookName = useCallback((bookName: string) => {
    return bookName.replace('.json', '').replace(/_/g, ' ');
  }, []);

  const handleChapterChange = useCallback((chapter: number) => {
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
  }, [setSelectedChapter, fadeAnim]);

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
      }
    }
  }, [selectedChapter, selectedBook, bookContent.length, handleChapterChange, setSelectedBook]);

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

  const copyVerse = useCallback((verse: string) => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(verse).then(() => {
        window.alert("El verso ha sido copiado al portapapeles.");
      });
    } else {
      Clipboard.setString(verse);
      Alert.alert("Copiado", "El verso ha sido copiado al portapapeles.");
    }
  }, []);

  const shareVerse = useCallback(async (verse: string) => {
    if (Platform.OS === 'web') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Compartir verso',
            text: verse,
          });
        } catch (error) {
          console.log('Error al compartir:', error);
        }
      } else {
        window.alert("La funcionalidad de compartir no está disponible en este navegador.");
      }
    } else {
      try {
        await Share.share({ message: verse });
      } catch (error) {
        Alert.alert("Error", "No se pudo compartir el verso.");
      }
    }
  }, []);

  const renderVerse = useCallback(({ item: verse, index: verseIndex }: { item: string, index: number }) => (
    <TouchableOpacity 
      onPress={() => {
        const processedVerse = processText(verse);
        showOptions([
          {
            text: favoriteVerses.includes(verse) ? "Desmarcar favorito" : "Marcar favorito",
            onPress: () => toggleFavoriteVerse(verse)
          },
          {
            text: "Copiar",
            onPress: () => copyVerse(processedVerse)
          },
          {
            text: "Compartir",
            onPress: () => shareVerse(processedVerse)
          }
        ]);
      }}
    >
      <View style={[styles.verse, favoriteVerses.includes(verse) && { backgroundColor: 'rgba(212, 175, 55, 0.2)' }]}>
        <Text style={[styles.verseNumber, { color: customColors.accent, fontSize: fontSize }]}>{verseIndex + 1}</Text>
        <Text style={[styles.verseText, { color: customColors.text, fontSize: fontSize, lineHeight: lineHeight }]}>{processText(verse)}</Text>
      </View>
    </TouchableOpacity>
  ), [favoriteVerses, customColors, fontSize, lineHeight, processText, toggleFavoriteVerse, copyVerse, shareVerse]);

  const increaseFontSize = useCallback(() => setFontSize(prev => Math.min(prev + 1, 30)), []);
  const decreaseFontSize = useCallback(() => setFontSize(prev => Math.max(prev - 1, 12)), []);
  const increaseLineHeight = useCallback(() => setLineHeight(prev => Math.min(prev + 1, 40)), []);
  const decreaseLineHeight = useCallback(() => setLineHeight(prev => Math.max(prev - 1, 20)), []);

  if (!fontsLoaded) {
    return null;
  }

  const currentText = bookContent[selectedChapter - 1].join('. ');
  const processedText = processText(currentText);
  const bookName = getBookName(selectedBook);
  const fullText = `Libro ${bookName}, capítulo ${selectedChapter}. ${processedText}`;

  return (
    <ImageBackground 
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.bookTitle, { color: customColors.text }]}>{getBookName(selectedBook)}</Text>
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
                  selectedChapter === index + 1 && styles.selectedChapterItem,
                ]}
                onPress={() => handleChapterChange(index + 1)}
              >
                <Text
                  style={[
                    styles.chapterText,
                    selectedChapter === index + 1 && styles.selectedChapterText,
                  ]}
                >
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          <FlatList
            style={styles.chapterContainer}
            contentContainerStyle={[styles.chapterContentContainer, { 
              backgroundColor: customColors.card,
            }]}
            data={bookContent[selectedChapter - 1]}
            renderItem={renderVerse}
            keyExtractor={(_, index) => `verse-${index}`}
          />
        </Animated.View>

        <TouchableOpacity 
          style={[styles.floatingButton, styles.floatingButtonLeft]}
          onPress={goToPreviousChapter}
        >
          <FontAwesome5 name="chevron-left" size={24} color={customColors.accent} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.floatingButton, styles.floatingButtonRight]}
          onPress={goToNextChapter}
        >
          <FontAwesome5 name="chevron-right" size={24} color={customColors.accent} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.floatingButton, styles.floatingButtonSettings]}
          onPress={() => setIsTextSettingsVisible(true)}
        >
          <FontAwesome5 name="font" size={24} color={customColors.accent} />
        </TouchableOpacity>

        <TextSettingsControl
          fontSize={fontSize}
          lineHeight={lineHeight}
          onIncreaseFontSize={increaseFontSize}
          onDecreaseFontSize={decreaseFontSize}
          onIncreaseLineHeight={increaseLineHeight}
          onDecreaseLineHeight={decreaseLineHeight}
          isVisible={isTextSettingsVisible}
          onClose={() => setIsTextSettingsVisible(false)}
        />

        <TTSControls text={fullText} />
      </SafeAreaView>
    </ImageBackground>
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
  header: {
    padding: 15,
    paddingBottom: 5,
  },
  bookTitle: {
    fontFamily: 'Lora_700Bold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 0,
    color: '#D4AF37', // Color dorado para el título
  },
  chapterPicker: {
    maxHeight: 50,
  },
  chapterPickerContent: {
    paddingHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: '4%',
    marginVertical: '2%',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chapterContainer: {
    flex: 1,
  },
  chapterContentContainer: {
    padding: '5%',
    paddingBottom: '10%',
    borderRadius: 15,
  },
  verse: {
    flexDirection: 'row',
    marginBottom: '4%',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  verseNumber: {
    fontWeight: 'bold',
    marginRight: '3%',
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
    borderRadius: 20,
    borderColor: '#D4AF37', // Borde dorado
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  chapterText: {
    fontFamily: 'Lora_700Bold',
    fontSize: 16,
  },
  selectedChapterText: {
    color: '#000000', // Texto negro para el capítulo seleccionado
  },
  selectedChapterItem: {
    borderWidth: 2,
    borderColor: '#D4AF37',
    backgroundColor: '#D4AF37', // Fondo dorado para el capítulo seleccionado
  },
  floatingButton: {
    position: 'absolute',
    backgroundColor: 'rgba(244, 233, 209, 0.7)',
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
    bottom: 20,
    left: 20,
  },
  floatingButtonRight: {
    bottom: 20,
    right: 20,
  },
  floatingButtonSettings: {
    bottom: 80,
    right: 20,
  },
});
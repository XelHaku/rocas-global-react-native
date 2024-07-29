import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

interface Slide {
  key: string;
  title: string;
  text: string;
  image: any;
  backgroundColor: string;
}

const slides: Slide[] = [
  {
    key: '1',
    title: 'Bienvenido',
    text: 'Esta es una introducción a la aplicación.',
    image: require('../assets/images/chatbot.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: '2',
    title: 'Explora',
    text: 'Descubre todas las funcionalidades.',
    image: require('../assets/images/chatbot.png'),
    backgroundColor: '#febe29',
  },
  {
    key: '3',
    title: 'Disfruta',
    text: 'Aprovecha al máximo la app.',
    image: require('../assets/images/chatbot.png'),
    backgroundColor: '#22bcb5',
  }
];

interface OnboardingProps {
  onDone: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onDone }) => {
  const _renderItem = ({ item }: { item: Slide }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  return <AppIntroSlider renderItem={_renderItem} data={slides} onDone={onDone} />;
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  image: {
    width: 320,
    height: 320,
    marginBottom: 20,
  }
});

export default Onboarding;

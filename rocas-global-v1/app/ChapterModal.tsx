import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Text, View } from "@/components/Themed";
import { getChapterSummary } from '@/utils/openai/getChapterSummary';
import useAppStore from '@/store/store';

export default function ChapterModal() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const selectedBook = useAppStore((state) => state.selectedBook);
  const selectedChapter = useAppStore((state) => state.selectedChapter);

  useEffect(() => {
    setLoading(true);
    getChapterSummary(selectedBook, selectedChapter)
      .then((result) => {
        setSummary(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching summary:", error);
        setSummary(null);
        setLoading(false);
      });
  }, [selectedBook, selectedChapter]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${selectedBook} - Capítulo ${selectedChapter}`}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : summary ? (
        <ScrollView style={styles.scrollView}>
          <Text style={styles.sectionTitle}>Resumen:</Text>
          <Text style={styles.summary}>{summary.abstract}</Text>
          <Text style={styles.sectionTitle}>Enseñanzas:</Text>
          <Text style={styles.summary}>{summary.teaching}</Text>
        </ScrollView>
      ) : (
        <Text style={styles.errorText}>Error al cargar el resumen. Por favor, intente de nuevo.</Text>
      )}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
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
    marginBottom: 10,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  scrollView: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  summary: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 15,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
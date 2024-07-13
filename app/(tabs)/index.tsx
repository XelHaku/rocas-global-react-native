import React, { useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import cursoData from "@/cursos/curso-01.json";
import * as Speech from "expo-speech";

export default function TabOneScreen() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakContent = (content) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(content, {
        language: "es", // Asumiendo que el contenido está en español
        pitch: 1.2,
        rate: 3,
        onDone: () => setIsSpeaking(false),
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cursos Disponibles</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{cursoData.nombre}</Text>
        {cursoData.modulos.map((modulo, index) => (
          <View key={modulo.id} style={styles.moduleCard}>
            <Text style={styles.moduleTitle}>{modulo.nombre}</Text>
            {modulo.paginas.map((pagina, pageIndex) => (
              <View key={pagina.id} style={styles.pageCard}>
                <Text style={styles.pageTitle}>{pagina.nombre}</Text>
                <Text style={styles.pageType}>{pagina.tipo}</Text>
                {pagina.tipo === "leccion" && (
                  <Text style={styles.pageContent} numberOfLines={2}>
                    {pagina.contenido}
                  </Text>
                )}
                {pagina.tipo === "trivia" && (
                  <Text style={styles.pageContent}>
                    Pregunta: {pagina.pregunta}
                  </Text>
                )}
                {pagina.tipo === "video" && (
                  <Text style={styles.pageContent}>URL: {pagina.url}</Text>
                )}
                <TouchableOpacity
                  style={styles.speakButton}
                  onPress={() =>
                    speakContent(
                      pagina.tipo === "leccion"
                        ? pagina.contenido
                        : pagina.tipo === "trivia"
                        ? `Pregunta: ${pagina.pregunta}`
                        : "Este contenido no se puede leer en voz alta."
                    )
                  }
                >
                  <Text style={styles.speakButtonText}>
                    {isSpeaking ? "Detener" : "Leer en voz alta"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ... (estilos previos se mantienen igual)
  speakButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  speakButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});

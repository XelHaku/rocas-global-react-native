import React from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import cursoData from "@/cursos/curso-01.json";
export default function TabOneScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cursos Disponibles</Text>

      {/* Tarjeta del Curso */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{cursoData.nombre}</Text>

        {/* Módulos */}
        {cursoData.modulos.map((modulo, index) => (
          <View key={modulo.id} style={styles.moduleCard}>
            <Text style={styles.moduleTitle}>{modulo.nombre}</Text>

            {/* Páginas */}
            {modulo.paginas.map((pagina, pageIndex) => (
              <TouchableOpacity key={pagina.id} style={styles.pageCard}>
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
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  moduleCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pageCard: {
    backgroundColor: "#e9e9e9",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pageType: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  pageContent: {
    fontSize: 14,
    color: "#333",
  },
});

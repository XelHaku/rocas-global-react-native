import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/Themed";

const PageCard = ({ pagina }) => (
  <View style={styles.pageCard}>
    <Text style={styles.pageTitle}>{pagina.nombre}</Text>
    <Text style={styles.pageType}>{pagina.tipo}</Text>
    {pagina.tipo === "leccion" && (
      <Text style={styles.pageContent} numberOfLines={2}>
        {pagina.contenido}
      </Text>
    )}
    {pagina.tipo === "trivia" && (
      <Text style={styles.pageContent}>Pregunta: {pagina.pregunta}</Text>
    )}
    {pagina.tipo === "video" && (
      <Text style={styles.pageContent}>URL: {pagina.url}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  pageCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pageType: {
    fontSize: 14,
    color: "#666",
  },
  pageContent: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default PageCard;

import React, { useState } from "react";
import { StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { FontAwesome } from '@expo/vector-icons';
import * as Speech from "expo-speech";

export default function PaginaModal({ pagina, visible, onClose }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakContent = (content) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(content, {
        language: "es",
        pitch: 1.2,
        rate: 0.8,
        onDone: () => setIsSpeaking(false),
      });
    }
  };

  if (!pagina) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>{pagina.nombre}</Text>
        {pagina.tipo === "leccion" && (
          <>
            <Text style={styles.modalContent}>{pagina.contenido}</Text>
            <TouchableOpacity
              style={styles.speakButton}
              onPress={() => speakContent(pagina.contenido)}
            >
              <FontAwesome 
                name={isSpeaking ? "pause" : "play"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </>
        )}
        {pagina.tipo === "trivia" && (
          <Text style={styles.modalContent}>Pregunta: {pagina.pregunta}</Text>
        )}
        {pagina.tipo === "video" && (
          <Text style={styles.modalContent}>URL del video: {pagina.url}</Text>
        )}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalContent: {
    marginBottom: 15,
    textAlign: 'center',
  },
  speakButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    padding: 10,
    elevation: 2,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});
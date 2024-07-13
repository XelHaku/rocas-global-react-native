import React, { useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, Modal, View } from "react-native";
import { Text } from "@/components/Themed";
import cursoData from "@/cursos/curso-01.json";
import { FontAwesome } from '@expo/vector-icons';

export default function TabOneScreen() {
  const [selectedModulo, setSelectedModulo] = useState(null);

  const openModuloModal = (modulo) => {
    setSelectedModulo(modulo);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{cursoData.nombre}</Text>
        {cursoData.modulos.map((modulo) => (
          <TouchableOpacity
            key={modulo.id}
            style={styles.moduleCard}
            onPress={() => openModuloModal(modulo)}
          >
            <Text style={styles.moduleTitle}>{modulo.nombre}</Text>
            <FontAwesome name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal para mostrar el contenido del módulo seleccionado */}
      {selectedModulo && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedModulo}
          onRequestClose={() => setSelectedModulo(null)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{selectedModulo.nombre}</Text>
            <ScrollView>
              {selectedModulo.paginas.map((pagina) => (
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
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedModulo(null)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  moduleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 15,
    marginBottom: 10,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
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
    elevation: 5,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  pageCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pageType: {
    fontSize: 14,
    color: '#666',
  },
  pageContent: {
    fontSize: 14,
    marginTop: 5,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});
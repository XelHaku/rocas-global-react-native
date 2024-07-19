import React, { useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, Modal, View } from "react-native";
import { Text } from "@/components/Themed";
import cursoData from "@/cursos/curso-01.json";

export default function TabOneScreen() {
  const [showCourseModal, setShowCourseModal] = useState(false);
  const openCourseModal = () => {
    setShowCourseModal(true);
  };

  
  return (
    <ScrollView style={styles.container}>
<TouchableOpacity style={styles.courseContainer} onPress={openCourseModal}>
  <Text style={styles.courseTitle}>Curso {cursoData.id}  </Text>
  <Text style={styles.courseTitle}>{cursoData.nombre}  </Text>
</TouchableOpacity>

{/*  */}
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
  modalContainer: {  // Full-screen container styles
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    width: '95%', // Make the modal take up most of the screen width
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    maxHeight: '100%',
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
  courseContainer: {
    backgroundColor: '#ffffff', // Fondo blanco de la tarjeta
    borderRadius: 10,         // Bordes redondeados
    padding: 20,              // Espacio interno
    shadowColor: '#000',     // Sombra para darle profundidad
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,             // Elevación para Android
    marginBottom: 20,         // Margen inferior para separar de los módulos
    alignItems: 'center',     // Centrar el contenido horizontalmente
  },
  courseTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333', 
  },

});
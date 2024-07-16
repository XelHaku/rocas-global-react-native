import React, { useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, Modal, View } from "react-native";
import { Text } from "@/components/Themed";
import cursoData from "@/cursos/curso-01.json";
import { FontAwesome } from '@expo/vector-icons';

export default function TabOneScreen() {
  const [selectedModulo, setSelectedModulo] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);

  const openModuloModal = (modulo) => {
    setSelectedModulo(modulo);
  };

  const openCourseModal = () => {
    setShowCourseModal(true);
  };

  
  return (
    <ScrollView style={styles.container}>
<TouchableOpacity style={styles.courseContainer} onPress={openCourseModal}>
  <Text style={styles.courseTitle}>Curso {cursoData.id}  </Text>
  <Text style={styles.courseTitle}>{cursoData.nombre}  </Text>
</TouchableOpacity>

<TouchableOpacity style={styles.courseContainer} onPress={openCourseModal}>
  <Text style={styles.courseTitle}>Curso {cursoData.id}  </Text>
  <Text style={styles.courseTitle}>{cursoData.nombre}  </Text>
</TouchableOpacity>

<TouchableOpacity style={styles.courseContainer} onPress={openCourseModal}>
  <Text style={styles.courseTitle}>Curso {cursoData.id}  </Text>
  <Text style={styles.courseTitle}>{cursoData.nombre}  </Text>
</TouchableOpacity>

<TouchableOpacity style={styles.courseContainer} onPress={openCourseModal}>
  <Text style={styles.courseTitle}>Curso {cursoData.id}  </Text>
  <Text style={styles.courseTitle}>{cursoData.nombre}  </Text>
</TouchableOpacity>

<TouchableOpacity style={styles.courseContainer} onPress={openCourseModal}>
  <Text style={styles.courseTitle}>Curso {cursoData.id}  </Text>
  <Text style={styles.courseTitle}>{cursoData.nombre}  </Text>
</TouchableOpacity>

<TouchableOpacity style={styles.courseContainer} onPress={openCourseModal}>
  <Text style={styles.courseTitle}>Curso {cursoData.id}  </Text>
  <Text style={styles.courseTitle}>{cursoData.nombre}  </Text>
</TouchableOpacity>

<TouchableOpacity style={styles.courseContainer} onPress={openCourseModal}>
  <Text style={styles.courseTitle}>Curso {cursoData.id}  </Text>
  <Text style={styles.courseTitle}>{cursoData.nombre}  </Text>
</TouchableOpacity>

<Modal visible={showCourseModal} animationType="slide" onRequestClose={() => setShowCourseModal(false)}>
  <View style={styles.modalContainer}> 
    {cursoData.modulos.map((modulo) => (
      <TouchableOpacity 
        key={modulo.id} 
        style={[styles.moduleCard, { backgroundColor: modulo.color || '#4CAF50' }]}
        onPress={() => {
          setSelectedModulo(modulo); // Abrir el modal de lecciones
          setShowCourseModal(false); // Cerrar el modal del curso
        }}
      >
        <FontAwesome name={modulo.icono || 'book'} size={36} color="white" />
        <Text style={styles.moduleTitle}>{modulo.nombre}</Text>
      </TouchableOpacity>
    ))}
    <TouchableOpacity style={styles.closeButton} onPress={() => setShowCourseModal(false)}>
      <Text style={styles.closeButtonText}>Cerrar</Text>
    </TouchableOpacity>
  </View>
</Modal>

      {/* Modal para mostrar el contenido del módulo seleccionado */}
      {selectedModulo && (
        <Modal
          animationType="slide"
          visible={!!selectedModulo}
          onRequestClose={() => setSelectedModulo(null)}
        >
          <View style={styles.modalContainer}>
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
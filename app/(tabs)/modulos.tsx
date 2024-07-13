import React, { useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { FontAwesome } from '@expo/vector-icons';
import cursosData from "@/cursos/curso-01.json";
import PaginaModal from "@/components/PaginaModal";

export default function Modulos({ route }) {
  const { cursoId } = route.params;
  const curso = cursosData.find(c => c.id === cursoId);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPagina, setSelectedPagina] = useState(null);

  const handlePaginaPress = (pagina) => {
    setSelectedPagina(pagina);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{curso.nombre}</Text>
      {curso.modulos.map((modulo) => (
        <View key={modulo.id} style={styles.moduloCard}>
          <Text style={styles.moduloTitle}>{modulo.nombre}</Text>
          {modulo.paginas.map((pagina) => (
            <TouchableOpacity
              key={pagina.id}
              style={styles.paginaItem}
              onPress={() => handlePaginaPress(pagina)}
            >
              <Text>{pagina.nombre}</Text>
              <FontAwesome name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <PaginaModal 
        pagina={selectedPagina} 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
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
    fontWeight: 'bold',
    marginBottom: 20,
  },
  moduloCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  moduloTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paginaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
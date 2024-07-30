import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '@react-navigation/native';
import useAppStore from '@/store/store';
import { bibliaRV1960 } from '@/constants/bibliaRV1960';
import { styles } from '@/constants/styles';

interface Libro {
  archivo: string;
  nombre: string;
  testamento: 'Viejo' | 'Nuevo';
}

export function BookSelector() {
  const { selectedBook, setSelectedBook } = useAppStore();
  const { colors } = useTheme();
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedTestament, setSelectedTestament] = useState<'Viejo' | 'Nuevo' | null>(null);
  const [libros, setLibros] = useState<Libro[]>([]);

  useEffect(() => {
    const adjustedBooks: Libro[] = bibliaRV1960.map(book => ({
      archivo: book.archivo,
      nombre: book.nombre,
      testamento: book.testamento as 'Viejo' | 'Nuevo',
    }));
    setLibros(adjustedBooks);
  }, []);

  useEffect(() => {
    if (libros.length > 0) {
      console.log("Número de libros cargados:", libros.length);
    }
  }, [libros]);

  const selectedBookName = libros.find(book => book.archivo === selectedBook)?.nombre || 'Seleccionar Libro';

  const viejoTestamento = libros.filter(book => book.testamento === 'Viejo');
  const nuevoTestamento = libros.filter(book => book.testamento === 'Nuevo');

  const handlePressTestament = (testament: 'Viejo' | 'Nuevo') => {
    setSelectedTestament(testament);
    setIsListVisible(true);
  };

  const handleSelectBook = (archivo: string) => {
    setSelectedBook(archivo);
    setIsListVisible(false);
    setSelectedTestament(null);
  };

  return (
    <View style={styles.bookSelectorContainer}>
      <TouchableOpacity
        style={[styles.bookSelectorButton, { backgroundColor: colors.background }]}
        onPress={() => setIsListVisible(true)}
      >
        <Text style={[styles.selectedBookText, { color: colors.text }]}>{selectedBookName}</Text>
        <FontAwesome name="book" size={24} color={colors.primary} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isListVisible}
        onRequestClose={() => setIsListVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.bookListContainer, { backgroundColor: colors.background }]}>
            {!selectedTestament ? (
              <View style={styles.testamentSelectionContainer}>
                <TouchableOpacity
                  onPress={() => handlePressTestament('Viejo')}
                  style={[styles.testamentButton]}
                >
                  <Text style={styles.testamentButtonText}>Viejo Testamento</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handlePressTestament('Nuevo')}
                  style={[styles.testamentButton]}
                >
                  <Text style={styles.testamentButtonText}>Nuevo Testamento</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={selectedTestament === 'Viejo' ? viejoTestamento : nuevoTestamento}
                keyExtractor={(item) => item.archivo}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectBook(item.archivo)}
                    style={[styles.bookItem, { backgroundColor: colors.background }]}
                  >
                    <Text style={{ color: colors.text }}>{item.nombre}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
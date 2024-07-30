import React, { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import useAppStore from '@/store/store';
import { bibliaRV1960 } from '@/constants/bibliaRV1960';
import { useTheme } from '@react-navigation/native';

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

interface Libro {
  archivo: string;
  nombre: string;
  testamento: 'Viejo' | 'Nuevo';
}

function BookSelector() {
  const { selectedBook, setSelectedBook } = useAppStore();
  const { colors } = useTheme();
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedTestament, setSelectedTestament] = useState<'Viejo' | 'Nuevo' | null>(null);
  const [libros, setLibros] = useState<Libro[]>([]);

  useEffect(() => {
    // Filtra y ajusta los tipos del array bibliaRV1960 antes de asignarlo a libros
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

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { theme, setTheme, activeTab, setActiveTab, selectedBook } = useAppStore();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: { backgroundColor: colors.card },
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
      }}
      screenListeners={{
        tabPress: (e) => {
          const tabName = e.target?.split('/').pop() || '';
          console.log('TabLayout: Cambiando a tab', tabName);
          setActiveTab(tabName);
        },
      }}
    >
      <Tabs.Screen
        name="biblia"
        options={{
          title: 'Biblia',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          headerTitle: () => <BookSelector />,
          headerRight: () => (
            <Link href="/ChapterModal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={colors.text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <TabBarIcon name="wechat" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={colors.text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bookSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  selectedBookText: {
    fontSize: 16,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bookListContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bookItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  testamentSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  testamentButton: {
    width: 120,
    height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    backgroundColor: 'gold', // Color dorado
  },
  testamentButtonText: {
    color: 'black', // Color del texto, puedes ajustar el contraste según sea necesario
    fontSize: 16,
    textAlign: 'center',
  },
});

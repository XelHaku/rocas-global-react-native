import React, { useState, useRef, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import useAppStore from '@/store/store';
import { bibliaRV1960 } from '@/constants/bibliaRV1960';
import { useTheme } from '@react-navigation/native';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function BookSelector() {
  const { selectedBook, setSelectedBook } = useAppStore();
  const { colors } = useTheme();
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedTestament, setSelectedTestament] = useState<'Viejo' | 'Nuevo' | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const selectedBookName = bibliaRV1960.find(book => book.archivo === selectedBook)?.nombre || 'Seleccionar Libro';

  useEffect(() => {
    if (isListVisible && scrollViewRef.current && selectedTestament) {
      const index = bibliaRV1960.findIndex(book => book.archivo === selectedBook && book.testamento === selectedTestament);
      scrollViewRef.current.scrollTo({ y: index * 40, animated: false });
    }
  }, [isListVisible, selectedBook, selectedTestament]);

  const viejoTestamento = bibliaRV1960.filter(book => book.testamento === 'Viejo');
  const nuevoTestamento = bibliaRV1960.filter(book => book.testamento === 'Nuevo');

  return (
    <View style={styles.bookSelectorContainer}>
      <TouchableOpacity onPress={() => setIsListVisible(true)} style={styles.bookSelectorButton}>
        <FontAwesome 
          name="book" 
          size={20} 
          color={colors.text}
          style={styles.bookIcon}
        />
        <Text style={[styles.selectedBookText, { color: colors.text }]}>{selectedBookName}</Text>
        <FontAwesome 
          name="chevron-down" 
          size={16} 
          color={colors.text}
          style={styles.chevronIcon}
        />
      </TouchableOpacity>
      <Modal
        visible={isListVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsListVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.bookListContainer, { backgroundColor: colors.card }]}>
            {selectedTestament === null ? (
              <View style={styles.testamentSelectionContainer}>
                <TouchableOpacity
                  style={[styles.testamentButton, { backgroundColor: '#D4AF37' }]}
                  onPress={() => setSelectedTestament('Viejo')}
                >
                  <FontAwesome 
                    name="book" 
                    size={24} 
                    color="white"
                    style={styles.testamentIcon}
                  />
                  <Text style={styles.testamentButtonText}>Viejo Testamento</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.testamentButton, { backgroundColor: '#D4AF37' }]}
                  onPress={() => setSelectedTestament('Nuevo')}
                >
                  <FontAwesome 
                    name="book" 
                    size={24} 
                    color="white"
                    style={styles.testamentIcon}
                  />
                  <Text style={styles.testamentButtonText}>Nuevo Testamento</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.listContainer}>
                <TouchableOpacity
                  style={styles.changeTestamentButton}
                  onPress={() => setSelectedTestament(null)}
                >
                  <Text style={styles.changeTestamentButtonText}>Cambiar Testamento</Text>
                </TouchableOpacity>
                <ScrollView ref={scrollViewRef} style={styles.scrollView}>
                  <Text style={[styles.testamentoTitle, { color: colors.text }]}>
                    {selectedTestament} Testamento
                  </Text>
                  {(selectedTestament === 'Viejo' ? viejoTestamento : nuevoTestamento).map((book) => (
                    <TouchableOpacity
                      key={book.archivo}
                      style={[
                        styles.bookItem,
                        selectedBook === book.archivo && { backgroundColor: colors.primary }
                      ]}
                      onPress={() => {
                        setSelectedBook(book.archivo);
                        setIsListVisible(false);
                      }}
                    >
                      <Text style={[styles.bookItemText, { color: colors.text }]}>{book.nombre}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
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
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  bookIcon: {
    marginRight: 5,
  },
  selectedBookText: {
    fontSize: 16,
    marginRight: 5,
  },
  chevronIcon: {
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  bookListContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  },
  testamentIcon: {
    marginBottom: 10,
  },
  testamentButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  changeTestamentButton: {
    padding: 10,
    backgroundColor: Colors.light.tint,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  changeTestamentButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  testamentoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  bookItem: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  bookItemText: {
    fontSize: 18,
  },
});
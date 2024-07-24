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
  const scrollViewRef = useRef<ScrollView>(null);

  const selectedBookName = bibliaRV1960.find(book => book.archivo === selectedBook)?.nombre || 'Seleccionar Libro';

  useEffect(() => {
    if (isListVisible && scrollViewRef.current) {
      const index = bibliaRV1960.findIndex(book => book.archivo === selectedBook);
      scrollViewRef.current.scrollTo({ y: index * 40, animated: false });
    }
  }, [isListVisible, selectedBook]);

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
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPressOut={() => setIsListVisible(false)}
        >
          <View style={[styles.bookListContainer, { backgroundColor: colors.card }]}>
            <ScrollView ref={scrollViewRef}>
              {bibliaRV1960.map((book) => (
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
        </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bookListContainer: {
    width: '80%',
    maxHeight: '80%',
    borderRadius: 10,
    padding: 10,
  },
  bookItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookItemText: {
    fontSize: 16,
  },
});
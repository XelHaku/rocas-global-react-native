import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import useStore from '../store/store';
import { bibliaRV1960 } from '@/constants/bibliaRV1960';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function BookSelector() {
  const { selectedBook, setSelectedBook } = useStore();
  const colorScheme = useColorScheme();

  return (
    <Picker
      selectedValue={selectedBook}
      style={styles.picker}
      onValueChange={(itemValue) => setSelectedBook(itemValue)}
      dropdownIconColor={Colors[colorScheme ?? 'light'].text}
    >
      {bibliaRV1960.map((book) => (
        <Picker.Item key={book.archivo} label={book.nombre} value={book.archivo} />
      ))}
    </Picker>
  );
}

export default function TabLayout() {
  const { theme, setTheme, activeTab, setActiveTab, selectedBook } = useStore();
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    console.log('TabLayout: Tema actual', theme);
  }, [theme]);

  useEffect(() => {
    if (systemColorScheme) {
      console.log('TabLayout: Cambiando tema basado en el sistema', systemColorScheme);
      setTheme(systemColorScheme);
    }
  }, [systemColorScheme, setTheme]);

  useEffect(() => {
    console.log('TabLayout: Tab activa', activeTab);
  }, [activeTab]);

  useEffect(() => {
    console.log('TabLayout: Libro seleccionado', selectedBook);
  }, [selectedBook]);

  const colorScheme = theme;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
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
        name="bible"
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
                    color={Colors[colorScheme ?? 'light'].text}
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
          title: 'Cursos',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <Tabs.Screen
        name="modulos"
        options={{
          title: 'Módulos',
          tabBarIcon: ({ color }) => <TabBarIcon name="th-large" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="send" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  picker: {
    width: 200,
    color: Colors.light.text,
  },
});
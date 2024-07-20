import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import useAppStore from '../store/store';
import { Picker } from '@react-native-picker/picker';
import { bibliaRV1960 } from '@/constants/bibliaRV1960';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
function BookSelector() {
  const { selectedBook, setSelectedBook } = useAppStore();
  const colorScheme = useColorScheme();

  return (
    <Picker
      selectedValue={selectedBook}
      // style={styles.picker}
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
  const colorScheme = useColorScheme();
  const { theme, setTheme, activeTab, setActiveTab, selectedBook } = useAppStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Cursos',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
      
        }}
      />



      <Tabs.Screen
        name="bible"
        options={{
          title: 'Biblia',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
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
        name="modulos"
        options={{
          title: 'Módulos',
          tabBarIcon: ({ color }) => <TabBarIcon name="th-large" color={color} />, // th-large es el ícono de FontAwesome para módulos
        }}
      />
         <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="send" color={color} />, // th-large es el ícono de FontAwesome para módulos
        }}
      />
    </Tabs>
  );
}

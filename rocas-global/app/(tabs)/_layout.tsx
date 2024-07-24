import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, Text, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import useAppStore from '@/store/store';
import { Picker } from '@react-native-picker/picker';
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
  const colorScheme = useColorScheme();
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const { colors } = useTheme();

  const selectedBookName = bibliaRV1960.find(book => book.archivo === selectedBook)?.nombre || 'Seleccionar Libro';

  return (
    <View style={styles.bookSelectorContainer}>
      <TouchableOpacity onPress={() => setIsPickerVisible(!isPickerVisible)} style={styles.bookSelectorButton}>
        <FontAwesome 
          name="book" 
          size={20} 
          color={colors.text}
          style={styles.bookIcon}
        />
        <Text style={[styles.selectedBookText, { color: colors.text }]}>{selectedBookName}</Text>
      </TouchableOpacity>
      {isPickerVisible && (
        <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Picker
            selectedValue={selectedBook}
            style={[styles.picker, { color: colors.text }]}
            onValueChange={(itemValue) => {
              setSelectedBook(itemValue);
              setIsPickerVisible(false);
            }}
            dropdownIconColor={colors.text}
          >
            {bibliaRV1960.map((book) => (
              <Picker.Item key={book.archivo} label={book.nombre} value={book.archivo} color={colors.text} />
            ))}
          </Picker>
        </View>
      )}
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
  },
  pickerContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderRadius: 5,
    borderWidth: 1,
    zIndex: 1000,
  },
  picker: {
    width: '100%',
  },
});
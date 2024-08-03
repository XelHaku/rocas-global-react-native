import React from 'react';
import { Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import useAppStore from '@/store/app.store';
import { useTheme } from '@react-navigation/native';
import { TabBarIcon } from '@/components/TabBarIcon';
import { BookSelector } from '@/components/BookSelector';

const GOLD_COLOR = '#D4AF37';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { setActiveTab } = useAppStore();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: GOLD_COLOR,
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
                    color={GOLD_COLOR}
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
                    color={GOLD_COLOR}
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
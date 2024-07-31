import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import useAppStore from '@/store/store';
import { web3auth } from '@/hooks/web3AuthConfig';

export default function RootLayout() {
  const { isLoggedIn, login } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await web3auth.init();
        if (web3auth.privKey) {
          const userInfo = web3auth.userInfo();
          login(userInfo?.email || 'Unknown');
        } else if (!isLoggedIn) {
          router.replace('/login');
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace('/login');
      }
    };

    checkAuth();
  }, [isLoggedIn, login, router]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
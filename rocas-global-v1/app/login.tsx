import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import useAppStore from '@/store/store';
import { web3auth } from '@/hooks/web3AuthConfig';

export default function Login() {
  const router = useRouter();
  const { login } = useAppStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
        setIsInitialized(true);
      } catch (error) {
        console.error("Initialization error", error);
      }
    };
    init();
  }, []);

  const handleLogin = async () => {
    try {
      if (!web3auth.ready) {
        console.log('Web3Auth not initialized');
        return;
      }

      await web3auth.login({
        loginProvider: "google"
      });

      if (web3auth.privKey) {
        const userInfo = web3auth.userInfo();
        login(userInfo?.email || 'Unknown');
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Login with Web3Auth" 
        onPress={handleLogin}
        disabled={!isInitialized}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});
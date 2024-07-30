import { useWeb3Auth } from '@/hooks/Web3AuthProvider';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const { login, logout, loggedIn, error } = useWeb3Auth();

  const handleLogin = async () => {
    if (email) {
      await login(email);
    }
  };

  return (
    <View style={styles.container}>
      {loggedIn ? (
        <View>
          <Text style={styles.text}>You are logged in!</Text>
          <Button title="Logout" onPress={logout} />
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button title="Login with Web3Auth" onPress={handleLogin} />
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
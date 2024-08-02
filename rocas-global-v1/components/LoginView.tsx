import React, { useState } from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';

export default function LoginView() {
  const [email, setEmail] = useState('');
  const { login } = useWeb3Auth();

  return (
    <View style={styles.buttonAreaLogin}>
      <TextInput
        style={styles.inputEmail}
        placeholder="Enter email"
        onChangeText={setEmail}
      />
      <Button title="Login with Web3Auth" onPress={() => login(email)} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonAreaLogin: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  inputEmail: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import LoginView from '../components/LoginView';
import LoggedInView from '../components/LoggedInView';
import { useWeb3Auth } from '../hooks/useWeb3Auth';

export default function Home() {
  const { loggedIn, console } = useWeb3Auth();
  
  return (
    <View style={styles.container}>
      {loggedIn ? <LoggedInView /> : <LoginView />}
      <View style={styles.consoleArea}>
        <Text style={styles.consoleText}>Console:</Text>
        <ScrollView style={styles.console}>
          <Text>{console}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 30,
  },
  consoleArea: {
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  console: {
    flex: 1,
    backgroundColor: '#CCCCCC',
    color: '#ffffff',
    padding: 10,
    width: Dimensions.get('window').width - 60,
  },
  consoleText: {
    padding: 10,
  },
});
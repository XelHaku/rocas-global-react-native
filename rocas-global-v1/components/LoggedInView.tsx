import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import React from 'react';
import { StyleSheet, View, Button } from 'react-native';

export default function LoggedInView() {
  const { logout, getAccounts, getBalance, signMessage, launchWalletServices, uiConsole, web3auth } = useWeb3Auth();

  return (
    <View style={styles.buttonArea}>
      <Button
        title="Get User Info"
        onPress={() => uiConsole(web3auth.userInfo)}
      />
      <Button title="Get Accounts" onPress={getAccounts} />
      <Button title="Get Balance" onPress={getBalance} />
      <Button title="Sign Message" onPress={signMessage} />
      <Button title="Show Wallet UI" onPress={launchWalletServices} />
      <Button title="Log Out" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonArea: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 30,
  },
});
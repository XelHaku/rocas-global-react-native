import React from "react";
import { View, Button } from "react-native";
import { styles } from "@/constants/styles";
import useBlockchainCalls from "@/hooks/useBlockchainCalls";
import Web3Auth from "@web3auth/react-native-sdk";

type LoggedInViewProps = {
  logout: () => Promise<void>;
  web3auth: Web3Auth;
  uiConsole: (...args: any[]) => void;
};

export default function LoggedInView({ logout, web3auth, uiConsole }: LoggedInViewProps) {
  const { getAccounts, getBalance, signMessage } = useBlockchainCalls(web3auth, uiConsole);

  const launchWalletServices = async () => {
    if (!web3auth) {
      uiConsole('Web3auth not initialized');
      return;
    }
    uiConsole('Launch Wallet Services');
    try {
      const chainConfig = (web3auth as any).options?.chainConfig;
      if (chainConfig) {
        await web3auth.launchWalletServices(chainConfig);
      } else {
        uiConsole('Chain config not available');
      }
    } catch (error) {
      uiConsole('Error launching wallet services:', error);
    }
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole('Web3auth not initialized');
      return;
    }
    const userInfo = web3auth.userInfo();
    uiConsole('User Info:', userInfo);
  };

  return (
    <View style={styles.buttonArea}>
      <Button title="Get User Info" onPress={getUserInfo} />
      <Button title="Get Accounts" onPress={getAccounts} />
      <Button title="Get Balance" onPress={getBalance} />
      <Button title="Sign Message" onPress={signMessage} />
      <Button title="Show Wallet UI" onPress={launchWalletServices} />
      <Button title="Log Out" onPress={logout} />
    </View>
  );
}
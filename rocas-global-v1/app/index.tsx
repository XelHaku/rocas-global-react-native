import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";

import { Button, Dimensions, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Constants, { AppOwnership } from "expo-constants";
import { useEffect, useState } from "react";
import Web3Auth, { ChainNamespace, LOGIN_PROVIDER, OpenloginUserInfo } from "@web3auth/react-native-sdk";

import RPC from "@/hooks/ethersRPC"; // for using ethers.js

const chainConfig = {
  chainNamespace: ChainNamespace.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  decimals: 18,
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const resolvedRedirectUrl =
  Constants.appOwnership === AppOwnership.Expo
    ? Linking.createURL("web3auth", {})
    : Linking.createURL("web3auth", { scheme: "myapp" });

const clientId = "BOokDqwdzMfZ9Qq3u_dHd_uIZZ9PjeI9UEt-ogZHsVjX02w75An40ekb-HTZ26ec_ABTMlD4Sg_bvcxfUp66Zks";

export default function Login() {
  const [key, setKey] = useState<string>("");
  const [userInfo, setUserInfo] = useState<OpenloginUserInfo | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [web3auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [email, setEmail] = useState<string>("hello@tor.us");
  
  useEffect(() => {
    const init = async () => {
      try {
        const auth = new Web3Auth(WebBrowser, SecureStore, {
          clientId,
          network: "sapphire_mainnet", // O sapphire_devnet para pruebas
          redirectUrl: resolvedRedirectUrl,
          enableLogging: true,
          buildEnv: "testing", // Cambia a "production" cuando vayas a producción
        });
        setWeb3Auth(auth);
        await auth.init();
        
        if (auth?.privKey) {
          uiConsole("Re logged in");
          setUserInfo(auth.userInfo() as OpenloginUserInfo);
          setKey(auth.privKey);
        }
      } catch (error) {
        // Captura información detallada del error
        const errorMessage = error instanceof Error ? error.message : String(error);
        uiConsole("Error initializing Web3Auth:", errorMessage);
      }
    };
    init();
  }, []);
  
  const login = async () => {
    if (!web3auth) {
      uiConsole("Web3Auth not initialized yet");
      return;
    }
    try {
      setConsoleOutput("Logging in");
      const loginResult = await web3auth.login({
        loginProvider: LOGIN_PROVIDER.GOOGLE, // Utiliza Google como proveedor de inicio de sesión
        redirectUrl: resolvedRedirectUrl,
        extraLoginOptions: {
          login_hint: email, // Si usas un login basado en email, puedes configurar esto
        },
      });
      uiConsole("Login result:", loginResult);

      if (web3auth.privKey) {
        setUserInfo(web3auth.userInfo() as OpenloginUserInfo);
        setKey(web3auth.privKey);
        uiConsole("Logged In");
      } else {
        uiConsole("Failed to get private key after login");
      }
    } catch (error) {
      uiConsole("Login failed:", error);
    }
  };

  const enableMFA = async () => {
    if (!web3auth) {
      setConsoleOutput("Web3Auth not initialized");
      return;
    }

    try {
      setConsoleOutput("Enable MFA");
      await web3auth.enableMFA();
      uiConsole("MFA enabled");
    } catch (error) {
      uiConsole("Enable MFA failed:", error);
    }
  };

  const launchWalletServices = async () => {
    if (!web3auth) {
      setConsoleOutput("Web3Auth not initialized");
      return;
    }

    try {
      setConsoleOutput("Launch Wallet Services");
      await web3auth.launchWalletServices(chainConfig);
    } catch (error) {
      uiConsole("Launch Wallet Services failed:", error);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      setConsoleOutput("Web3Auth not initialized");
      return;
    }

    try {
      setConsoleOutput("Logging out");
      await web3auth.logout();

      if (!web3auth.privKey) {
        setUserInfo(null);
        setKey("");
        uiConsole("Logged out");
      }
    } catch (error) {
      uiConsole("Logout failed:", error);
    }
  };

  const getChainId = async () => {
    try {
      setConsoleOutput("Getting chain id");
      const networkDetails = await RPC.getChainId();
      uiConsole(networkDetails);
    } catch (error) {
      uiConsole("Get Chain ID failed:", error);
    }
  };

  const getAccounts = async () => {
    try {
      setConsoleOutput("Getting account");
      const address = await RPC.getAccounts(key);
      uiConsole(address);
    } catch (error) {
      uiConsole("Get Accounts failed:", error);
    }
  };

  const getBalance = async () => {
    try {
      setConsoleOutput("Fetching balance");
      const balance = await RPC.getBalance(key);
      uiConsole(balance);
    } catch (error) {
      uiConsole("Get Balance failed:", error);
    }
  };

  const sendTransaction = async () => {
    try {
      setConsoleOutput("Sending transaction");
      const tx = await RPC.sendTransaction(key);
      uiConsole(tx);
    } catch (error) {
      uiConsole("Send Transaction failed:", error);
    }
  };

  const signMessage = async () => {
    try {
      setConsoleOutput("Signing message");
      const message = await RPC.signMessage(key);
      uiConsole(message);
    } catch (error) {
      uiConsole("Sign Message failed:", error);
    }
  };

  const requestSignature = async () => {
    if (!web3auth) {
      setConsoleOutput("Web3Auth not initialized");
      return;
    }
    if (!key) {
      setConsoleOutput("User not logged in");
      return;
    }

    try {
      const address = await RPC.getAccounts(key);
      const params = ["Hello World", address];

      setConsoleOutput("Request Signature");
      const res = await web3auth.request(chainConfig, "personal_sign", params);
      uiConsole(res);
    } catch (error) {
      uiConsole("Request Signature failed:", error);
    }
  };

  const uiConsole = (...args: unknown[]) => {
    setConsoleOutput(`${JSON.stringify(args || {}, null, 2)}\n\n\n\n${consoleOutput}`);
  };

  const loggedInView = (
    <View style={styles.buttonArea}>
      <Button title="Get User Info" onPress={() => uiConsole(userInfo)} />
      <Button title="Enable MFA" onPress={enableMFA} />
      <Button title="Launch Wallet Services" onPress={launchWalletServices} />
      <Button title="Request Signature" onPress={requestSignature} />
      <Button title="Get Chain ID" onPress={getChainId} />
      <Button title="Get Accounts" onPress={getAccounts} />
      <Button title="Get Balance" onPress={getBalance} />
      <Button title="Send Transaction" onPress={sendTransaction} />
      <Button title="Sign Message" onPress={signMessage} />
      <Button title="Get Private Key" onPress={() => uiConsole(key)} />
      <Button title="Log Out" onPress={logout} />
    </View>
  );

  const unloggedInView = (
    <View style={styles.buttonArea}>
      <TextInput
        editable
        onChangeText={setEmail}
        value={email}
        style={{ padding: 10 }}
      />
      <Button title="Login with Web3Auth" onPress={login} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.header}>Web3Auth Example</Text>
        {userInfo ? loggedInView : unloggedInView}
        <Text style={styles.console}>{consoleOutput}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  console: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Courier New",
    color: "black",
  },
  buttonArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
});

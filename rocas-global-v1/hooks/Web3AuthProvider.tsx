import React, { useState, useEffect, createContext, useContext } from 'react';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import Web3Auth, { OPENLOGIN_NETWORK, LOGIN_PROVIDER, ChainNamespace } from '@web3auth/react-native-sdk';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';

const redirectUrl = Linking.createURL('web3auth', {});

const clientId = 'BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ';

const chainConfig = {
  chainNamespace: ChainNamespace.EIP155,
  chainId: '0xaa36a7',
  rpcTarget: 'https://rpc.ankr.com/eth_sepolia',
  displayName: 'Ethereum Sepolia Testnet',
  blockExplorerUrl: 'https://sepolia.etherscan.io',
  ticker: 'ETH',
  tickerName: 'Ethereum',
  decimals: 18,
  logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
};

const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth(WebBrowser, SecureStore, {
  clientId,
  redirectUrl,
  network: OPENLOGIN_NETWORK.SAPPHIRE_MAINNET,
});

type Web3AuthContextType = {
  web3auth: Web3Auth;
  provider: any;
  loggedIn: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
};

const Web3AuthContext = createContext<Web3AuthContextType>({
  web3auth,
  provider: null,
  loggedIn: false,
  login: async () => {},
  logout: async () => {},
  error: null,
});

export const useWeb3Auth = () => useContext(Web3AuthContext);

export const Web3AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<any>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("Starting Web3Auth initialization");
        await web3auth.init();
        console.log("Web3Auth initialized successfully");
        if (web3auth.privKey) {
          console.log("Setting up provider");
          await ethereumPrivateKeyProvider.setupProvider(web3auth.privKey);
          setProvider(ethereumPrivateKeyProvider);
          setLoggedIn(true);
          console.log("Provider set up successfully");
        }
      } catch (err) {
        console.error("Error during Web3Auth initialization:", err);
        setError(err instanceof Error ? err.message : String(err));
      }
    };
    init();
  }, []);

  const login = async (email: string) => {
    try {
      setError(null);
      if (!web3auth.ready) {
        throw new Error('Web3Auth not initialized');
      }
      await web3auth.login({
        loginProvider: LOGIN_PROVIDER.EMAIL_PASSWORDLESS,
        extraLoginOptions: {
          login_hint: email,
        },
      });
      if (web3auth.privKey) {
        await ethereumPrivateKeyProvider.setupProvider(web3auth.privKey);
        setProvider(ethereumPrivateKeyProvider);
        setLoggedIn(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const logout = async () => {
    try {
      setError(null);
      if (!web3auth.ready) {
        throw new Error('Web3Auth not initialized');
      }
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
    } catch (err) {
      console.error("Logout error:", err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <Web3AuthContext.Provider value={{ web3auth, provider, loggedIn, login, logout, error }}>
      {children}
    </Web3AuthContext.Provider>
  );
};
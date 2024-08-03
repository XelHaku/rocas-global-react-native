import { create } from "zustand";
import { IProvider } from "@web3auth/base";

import * as WebBrowser from '@toruslabs/react-native-web-browser';
import EncryptedStorage from 'react-native-encrypted-storage';
import Web3Auth, {
  LOGIN_PROVIDER,
  OPENLOGIN_NETWORK,
  ChainNamespace,
} from '@web3auth/react-native-sdk';
import {EthereumPrivateKeyProvider} from '@web3auth/ethereum-provider';

const clientId =
  "BEqJpWZCGPuvtZX1r-e_KMP1Ril3r5pqeiTM1u5ndb0QR3bm1cFLOkYF8Ue-R4slKD6KgVMj2XJeNmI10qBlgWs";

const chainConfig = {
  chainId: "0xa4b1",
  rpcTarget: "https://arb1.arbitrum.io/rpc",
  chainNamespace: ChainNamespace.EIP155,
  displayName: "Arbitrum One",
  blockExplorerUrl: "https://arbiscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://assets.coingecko.com/coins/images/13029/small/Arbitrum_Logo_256x256.png",
};

type UserStore = {
  connected: boolean;
  playerAddress: string | null;
  ethBalance: string;
  atonBalance: string;
  level: number;
  totalCommission: string;
  isLoading: boolean;
  error: string | null;
  web3auth: Web3Auth | null;
  provider: LOGIN_PROVIDER  | null;
  setPlayerAddress: (playerAddress: string) => void;
  setConnected: (connected: boolean) => void;
  setEthBalance: (balance: string) => void;
  setAtonBalance: (balance: string) => void;
  initializeWeb3Auth: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkConnection: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  connected: false,
  playerAddress: null,
  ethBalance: "",
  atonBalance: "",
  level: 0,
  totalCommission: "",
  isLoading: true,
  error: null,
  web3auth: null,
  provider: null,

  setPlayerAddress: (playerAddress: string) => set({ playerAddress }),
  setConnected: (connected: boolean) => set({ connected }),
  setEthBalance: (balance: string) => set({ ethBalance: balance }),
  setAtonBalance: (balance: string) => set({ atonBalance: balance }),

  initializeWeb3Auth: async () => {
    try {
      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: { chainConfig },
      });
      const web3auth = new Web3Auth({
        clientId,
        chainConfig,
        privateKeyProvider,
        uiConfig: {
          theme: "dark",
          loginMethodsOrder: [
            "google",
            "facebook",
            "twitter",
            "github",
            "apple",
            "linkedin",
            "email_passwordless",
          ],
        },
      });
      await web3auth.initModal();
      set({ web3auth, provider: web3auth.provider, isLoading: false });
      console.log("Web3Auth initialized");
      await get().checkConnection();
    } catch (error) {
      console.error("Error initializing Web3Auth:", error);
      set({
        error: "Failed to initialize Web3Auth. Please try again.",
        isLoading: false,
      });
    }
  },

  checkConnection: async () => {
    const { web3auth } = get();
    if (web3auth) {
      const isConnected = await web3auth.connected;
      console.log("Checking connection:", isConnected);
      if (isConnected) {
        const userInfo = await web3auth.getUserInfo();
        const address = await web3auth.provider?.request({
          method: "eth_accounts",
        });
        console.log("User info:", userInfo);
        console.log("Address:", address);
        set({
          connected: true,
          playerAddress: Array.isArray(address) ? address[0] : null,
        });
      } else {
        set({ connected: false, playerAddress: null });
      }
    }
  },

  login: async () => {
    const { web3auth } = get();
    if (!web3auth) {
      console.error("Web3Auth not initialized");
      return;
    }
    try {
      const web3authProvider = await web3auth.connect();
      set({ provider: web3authProvider });
      await get().checkConnection();
    } catch (error) {
      console.error("Error during login:", error);
      set({ error: "Login failed. Please try again." });
    }
  },

  logout: async () => {
    const { web3auth } = get();
    if (!web3auth) {
      console.error("Web3Auth not initialized");
      return;
    }
    try {
      await web3auth.logout();
      set({
        provider: null,
        connected: false,
        playerAddress: null,
        ethBalance: "",
        atonBalance: "",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      set({ error: "Logout failed. Please try again." });
    }
  },
}));


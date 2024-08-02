import '@ethersproject/shims';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import { Platform } from 'react-native';
import Web3Auth, { LOGIN_PROVIDER, OPENLOGIN_NETWORK, ChainNamespace } from '@web3auth/react-native-sdk';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';

// Importación condicional de EncryptedStorage
let EncryptedStorage;
if (Platform.OS === 'web') {
  // Mock para entorno web
  EncryptedStorage = {
    setItem: async (key: string, value: string) => localStorage.setItem(key, value),
    getItem: async (key: string) => localStorage.getItem(key),
    removeItem: async (key: string) => localStorage.removeItem(key),
    clear: async () => localStorage.clear(),
  };
} else {
  // Importación real para plataformas nativas
  EncryptedStorage = require('react-native-encrypted-storage').default;
}

const scheme = 'web3authrnexample';
const redirectUrl = `${scheme}://openlogin`;
const clientId = 'BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ';

export const chainConfig = {
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

export const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

export const initWeb3Auth = async () => {
  try {
    const web3auth = new Web3Auth(WebBrowser, EncryptedStorage, {
      clientId,
      redirectUrl,
      network: OPENLOGIN_NETWORK.SAPPHIRE_MAINNET,
    });

    await web3auth.init();
    return web3auth;
  } catch (error) {
    console.error("Failed to initialize Web3Auth:", error);
    throw error;
  }
};
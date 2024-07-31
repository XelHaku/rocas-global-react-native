import { ethers } from 'ethers';
import Web3Auth from "@web3auth/react-native-sdk";
import { IProvider } from '@web3auth/base';

export default function useBlockchainCalls(web3auth: Web3Auth, uiConsole: (...args: any[]) => void) {
  const getProvider = (): ethers.BrowserProvider | null => {
    if (!web3auth) {
      throw new Error('Web3Auth not initialized');
    }
    // Accedemos a provider directamente, sin await
    const provider = (web3auth as any).provider;
    if (!provider) {
      return null;
    }
    return new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
  };

  const getAccounts = async () => {
    try {
      const provider = getProvider();
      if (!provider) {
        throw new Error('Provider not initialized');
      }
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      uiConsole('Address:', address);
    } catch (error) {
      uiConsole('Error getting accounts:', error);
    }
  };

  const getBalance = async () => {
    try {
      const provider = getProvider();
      if (!provider) {
        throw new Error('Provider not initialized');
      }
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      uiConsole('Balance:', ethers.formatEther(balance));
    } catch (error) {
      uiConsole('Error getting balance:', error);
    }
  };

  const signMessage = async () => {
    try {
      const provider = getProvider();
      if (!provider) {
        throw new Error('Provider not initialized');
      }
      const signer = await provider.getSigner();
      const originalMessage = 'YOUR_MESSAGE';
      const signedMessage = await signer.signMessage(originalMessage);
      uiConsole('Signed Message:', signedMessage);
    } catch (error) {
      uiConsole('Error signing message:', error);
    }
  };

  return { getAccounts, getBalance, signMessage };
}
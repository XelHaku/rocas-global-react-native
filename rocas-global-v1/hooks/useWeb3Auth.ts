import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { web3auth, ethereumPrivateKeyProvider, chainConfig } from '../utils/web3auth';
import { LOGIN_PROVIDER } from '@web3auth/react-native-sdk';

export function useWeb3Auth() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [console, setConsole] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      await web3auth.init();
      if (web3auth.privKey) {
        await ethereumPrivateKeyProvider.setupProvider(web3auth.privKey);
        setProvider(ethereumPrivateKeyProvider);
        setLoggedIn(true);
      }
    };
    init();
  }, []);

  const login = async (email: string) => {
    try {
      if (!web3auth.ready) {
        setConsole('Web3auth not initialized');
        return;
      }
      if (!email) {
        setConsole('Enter email first');
        return;
      }

      setConsole('Logging in');
      await web3auth.login({
        loginProvider: LOGIN_PROVIDER.EMAIL_PASSWORDLESS,
        extraLoginOptions: {
          login_hint: email,
        },
      });

      if (web3auth.privKey) {
        await ethereumPrivateKeyProvider.setupProvider(web3auth.privKey);
        setProvider(ethereumPrivateKeyProvider);
        uiConsole('Logged In');
        setLoggedIn(true);
      }
    } catch (e: any) {
      setConsole(e.message);
    }
  };

  const logout = async () => {
    if (!web3auth.ready) {
      setConsole('Web3auth not initialized');
      return;
    }

    setConsole('Logging out');
    await web3auth.logout();

    if (!web3auth.privKey) {
      setProvider(null);
      uiConsole('Logged out');
      setLoggedIn(false);
    }
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole('provider not set');
      return;
    }
    setConsole('Getting account');
    const ethersProvider = new ethers.BrowserProvider(provider!);
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole('provider not set');
      return;
    }
    setConsole('Fetching balance');
    const ethersProvider = new ethers.BrowserProvider(provider!);
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    const balance = ethers.formatEther(
      await ethersProvider.getBalance(address),
    );
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole('provider not set');
      return;
    }
    setConsole('Signing message');
    const ethersProvider = new ethers.BrowserProvider(provider!);
    const signer = await ethersProvider.getSigner();
    const originalMessage = 'YOUR_MESSAGE';
    const signedMessage = await signer.signMessage(originalMessage);
    uiConsole(signedMessage);
  };

  const launchWalletServices = async () => {
    if (!web3auth) {
      setConsole('Web3auth not initialized');
      return;
    }

    setConsole('Launch Wallet Services');
    await web3auth.launchWalletServices(chainConfig);
  };

  const uiConsole = (...args: unknown[]) => {
    setConsole(JSON.stringify(args || {}, null, 2) + '\n\n\n\n' + console);
  };

  return {
    loggedIn,
    provider,
    console,
    login,
    logout,
    getAccounts,
    getBalance,
    signMessage,
    launchWalletServices,
    uiConsole,
    web3auth,
  };
}
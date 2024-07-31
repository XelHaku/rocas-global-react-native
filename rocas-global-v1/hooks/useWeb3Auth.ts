import { LOGIN_PROVIDER } from "@web3auth/react-native-sdk";
import { useState, useEffect } from "react";
import { web3auth, ethereumPrivateKeyProvider } from "./web3AuthConfig";

export default function useWeb3Auth() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [provider, setProvider] = useState<any>(null);

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
        throw new Error('Web3auth not initialized');
      }
      if (!email) {
        throw new Error('Enter email first');
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
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const logout = async () => {
    if (!web3auth.ready) {
      throw new Error('Web3auth not initialized');
    }
    await web3auth.logout();
    if (!web3auth.privKey) {
      setProvider(null);
      setLoggedIn(false);
    }
  };

  return { loggedIn, login, logout, web3auth, provider };
}
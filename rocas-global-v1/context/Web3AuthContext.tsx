import React, { createContext, useContext } from 'react';
import { useWeb3Auth } from '../hooks/useWeb3Auth';

const Web3AuthContext = createContext<ReturnType<typeof useWeb3Auth> | null>(null);

export const Web3AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const web3AuthValues = useWeb3Auth();

  return (
    <Web3AuthContext.Provider value={web3AuthValues}>
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3AuthContext = () => {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error('useWeb3AuthContext must be used within a Web3AuthProvider');
  }
  return context;
};
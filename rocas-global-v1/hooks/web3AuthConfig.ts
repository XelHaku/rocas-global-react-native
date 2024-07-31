import Web3Auth from "@web3auth/react-native-sdk";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Mainnet
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorerUrl: "https://etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
};

const web3AuthOptions: any = {
  clientId,
  network: "cyan",
  chainConfig: chainConfig
};

export const web3auth = new Web3Auth(WebBrowser, SecureStore, web3AuthOptions);
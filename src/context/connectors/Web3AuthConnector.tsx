// Web3Auth Libraries
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";

import { Chain } from "wagmi";
const CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "not-found";

export default function Web3AuthConnectorInstance(chains: Chain[]) {
  // Create Web3Auth Instance

  const web3AuthInstance = new Web3Auth({
    clientId: CLIENT_ID,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      rpcTarget: "https://polygon-rpc.com",
      blockExplorer: "https://polygonscan.com/",
      chainId: "0x89",
      displayName: "Polygon Mainnet",
      ticker: "matic",
      tickerName: "Matic",
    },
    uiConfig: {
      loginMethodsOrder: ["google", "twitter", "facebook"],
      defaultLanguage: "en",
    },
    web3AuthNetwork: "testnet",
  });

  // Add openlogin adapter for customisations
  const openloginAdapterInstance = new OpenloginAdapter({
    loginSettings: {
      mfaLevel: "default",
    },
  });
  web3AuthInstance.configureAdapter(openloginAdapterInstance);

  return new Web3AuthConnector({
    chains: chains,
    options: {
      web3AuthInstance,
    },
  });
}

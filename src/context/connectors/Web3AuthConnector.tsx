// Web3Auth Libraries
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import {
  OpenloginAdapter,
  OPENLOGIN_NETWORK,
} from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";

import { Chain } from "wagmi";
const CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "not-found";

export default function Web3AuthConnectorInstance(chains: Chain[]) {
  // Create Web3Auth Instance

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x" + chains[0].id.toString(16),
    rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorer: chains[0].blockExplorers?.default.url[0] as string,
  };

  const web3AuthInstance = new Web3AuthNoModal({
    clientId: CLIENT_ID,
    chainConfig,
    web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_DEVNET,
  });

  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  });

  // Add openlogin adapter for customisations
  const openloginAdapterInstance = new OpenloginAdapter({
    privateKeyProvider,
    adapterSettings: {
      uxMode: "popup",
      whiteLabel: {
        appName: "PERMISIONLESS",
      },
    },
  });
  web3AuthInstance.configureAdapter(openloginAdapterInstance);

  // Add Torus Wallet Plugin (optional)

  return new Web3AuthConnector({
    chains: chains,
    options: {
      web3AuthInstance,
      loginParams: {
        loginProvider: "google",
      },
    },
  });
}

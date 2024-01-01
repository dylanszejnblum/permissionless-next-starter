import { polygonMumbai } from "@wagmi/core/chains";
import { FC, ReactNode } from "react";
import { createPublicClient, http } from "viem";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import Web3AuthConnectorInstance from "@/context/connectors/Web3AuthConnector";

import { publicProvider } from "wagmi/providers/public";
const { chains, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    }),
    publicProvider(),
  ]
);

const config = createConfig({
  autoConnect: false,
  publicClient: createPublicClient({
    chain: polygonMumbai,
    transport: http(),
  }),
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    Web3AuthConnectorInstance(chains),

    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      },
    }),

    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],

  webSocketPublicClient,
});

interface WagmiProviderProps {
  children: ReactNode;
}

export const WagmiProvider: FC<WagmiProviderProps> = ({ children }) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};

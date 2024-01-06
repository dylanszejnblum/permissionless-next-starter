import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiProvider } from "../context/WagmiContext";
import { SmartAccountProvider } from "@/context/SmartAccountContext";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DynamicContextProvider
        settings={{
          environmentId: process.env.NEXT_PUBLIC_DYMANIC_ENVIROMENT as string,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <DynamicWagmiConnector>
          <WagmiProvider>
            <SmartAccountProvider>
              <Navbar />
              <Component {...pageProps} />
              <Toaster />
              <Footer />
            </SmartAccountProvider>
          </WagmiProvider>
        </DynamicWagmiConnector>
      </DynamicContextProvider>
    </ThemeProvider>
  );
  3;
}

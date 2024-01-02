import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiProvider } from "../context/WagmiContext";
import { SmartAccountProvider } from "@/context/SmartAccountContext";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WagmiProvider>
        <SmartAccountProvider>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </SmartAccountProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
  3;
}

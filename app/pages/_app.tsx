import "@/styles/globals.css";
import { WagmiConfig, createClient } from "wagmi";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient,
} from "connectkit";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { Header } from "components/header";

const alchemyId = process.env.ALCHEMY_ID;

const client = createClient(
  getDefaultClient({
    appName: "Moonboard",
    alchemyId: "pLxXshVDXE8WjhP-K5EvYX-991FaaJWK",
  })
);

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <Header />
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

/**
 * SSR doesn't work well with wagmi
 */
export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});

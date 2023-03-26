import "@reach/dialog/styles.css";
import "styles/globals.css";
import { WagmiConfig, createClient, Chain } from "wagmi";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient,
} from "connectkit";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { Header } from "components/header";
import {
  mainnet,
  hardhat,
  goerli,
  polygon,
  polygonZkEvmTestnet,
} from "wagmi/chains";
import { Montserrat } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { scrollAlpha } from "constants/custom-chains";

const alchemyId = process.env.ALCHEMY_ID;
const montserrat = Montserrat({ subsets: ["latin"] });

const getChains = (): Chain[] => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "localhost") {
    return [hardhat];
  } else {
    return [scrollAlpha, polygonZkEvmTestnet];
  }
};

const client = createClient(
  getDefaultClient({
    appName: "Moonboard",
    chains: getChains(),
  })
);

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <QueryClientProvider client={queryClient}>
          <div className={montserrat.className}>
            <Header />
            <div className="mx-8">
              <Component {...pageProps} />
            </div>
          </div>
        </QueryClientProvider>
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

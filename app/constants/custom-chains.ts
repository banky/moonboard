import { Chain } from "wagmi";

export const scrollAlpha: Chain = {
  name: "Scroll Alpha",
  id: 534353,
  network: "Scroll Alpha",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://alpha-rpc.scroll.io/l2"],
    },
    public: {
      http: ["https://alpha-rpc.scroll.io/l2"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://blockscout.scroll.io",
    },
  },
};

export const polygonZkEvmTestnet: Chain = {
  id: 1442,
  name: "Polygon zkEVM Testnet",
  network: "polygon-zkevm-testnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.public.zkevm-test.net"],
    },
    public: {
      http: ["https://rpc.public.zkevm-test.net"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://explorer.public.zkevm-test.net",
    },
  },
  testnet: true,
};

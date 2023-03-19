import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting) return <div>Connecting...</div>;

  return (
    <div>
      <main>
        <h2>Explore</h2>

        <div>
          <input placeholder="Search" />
          <button>All</button>
          <button>Moonpins</button>
          <button>Moonboards</button>
        </div>
      </main>
      <div>Connected Wallet: {address}</div>
    </div>
  );
}

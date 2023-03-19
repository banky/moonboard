import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useRouter } from "next/router";
import { Input } from "components/input";
import { Tab, TitleBarTabs } from "components/title-bar-tabs";
import { Button } from "components/button";

export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting) return <div>Connecting...</div>;

  return (
    <main>
      <h1 className="my-8 text-center">Explore Moonboards</h1>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 h-10">
          <Input placeholder="Search" className="w-72" />
          <TitleBarTabs>
            <Tab filter="all" isDefault>
              All
            </Tab>
            <Tab filter="moonpins">Moonpins</Tab>
            <Tab filter="moonboards">Moonboards</Tab>
          </TitleBarTabs>
        </div>
        <Button>Create Moonboard</Button>
      </div>
    </main>
  );
}

import { useAccount } from "wagmi";
import { Input } from "components/input";
import { Tab, TitleBarTabs } from "components/title-bar-tabs";
import { Button } from "components/button";
import { Star } from "svg/star";

export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting) return <div>Connecting...</div>;

  return (
    <main>
      <h1 className="m-12 text-center">Explore Moonboards</h1>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 h-10">
          <Input placeholder="Search" className="w-72" />
        </div>
        <div className="flex items-center gap-8">
          <TitleBarTabs>
            <Tab filter="all" isDefault>
              <div className="flex items-center gap-2">
                <p>Most Pins</p>
                <Star />
              </div>
            </Tab>
            <Tab filter="moonpins">
              <div className="flex items-center gap-2">
                <p>Most Votes</p>
                <Star />
              </div>
            </Tab>
            <Tab filter="moonboards">
              <div className="flex items-center gap-2">
                <p>Latest</p>
                <Star />
              </div>
            </Tab>
          </TitleBarTabs>
          <Button>Create Moonboard</Button>
        </div>
      </div>
    </main>
  );
}

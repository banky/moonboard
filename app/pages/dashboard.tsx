import { Button } from "components/button";
import { Tab, TitleBarTabs } from "components/title-bar-tabs";
import Link from "next/link";

export default function Dashboard() {
  return (
    <main>
      <h1 className="my-8 text-center">Dashboard</h1>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 h-10">
          <TitleBarTabs>
            <Tab filter="your-pins" isDefault>
              Your Pins
            </Tab>
            <Tab filter="moonpins">Moonpins</Tab>
            <Tab filter="moonboards">Moonboards</Tab>
            <Tab filter="settings">Settings</Tab>
          </TitleBarTabs>
        </div>
        <Link href="/create-moonboard">
          <Button>Create</Button>
        </Link>
      </div>
    </main>
  );
}

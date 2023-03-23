import { useAccount } from "wagmi";
import { Input } from "components/input";
import { Tab, TitleBarTabs } from "components/title-bar-tabs";
import { Button } from "components/button";
import { Star } from "svg/star";
import { useState } from "react";
import { Modal } from "components/modal";
import { CloseButton } from "components/close-button";
import { ModalOption } from "components/modal-option";
import Link from "next/link";

export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount();

  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  return (
    <main>
      <h1 className="m-12 text-center">Explore Moonboards</h1>

      <div className="flex items-center justify-between">
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
          <Button onClick={open}>Create Moonboard</Button>
        </div>
      </div>

      <Modal isOpen={showDialog} onDismiss={close}>
        <div className="m-4">
          <div className="flex justify-between">
            <div>
              <h1 className="text-lg">Create Moonboard</h1>
              <p className="">
                Choose what content you want to put into your board
              </p>
            </div>

            <CloseButton className="" onClick={close} />
          </div>

          <div className="h-0.5 -mx-4 bg-outlines my-4" />

          <div className="grid grid-cols-2 gap-4">
            <ModalOption>
              <Link href="/create-moonboard">From uploaded images</Link>
            </ModalOption>
            <ModalOption disabled>
              From another moonboard (coming soon)
            </ModalOption>
            <ModalOption disabled>From your wallet (coming soon)</ModalOption>
            <ModalOption disabled>From your pins (coming soon)</ModalOption>
          </div>
        </div>
      </Modal>
    </main>
  );
}

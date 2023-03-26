import { Button } from "components/button";
import { FilterTab, Filter } from "components/filter";
import Link from "next/link";
import { Sort } from "svg/sort";
import { useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { MoonBoardABI, MoonpinABI } from "contracts";
import { BigNumber } from "ethers";
import Masonry from "react-masonry-css";
import { useQuery } from "@tanstack/react-query";
import { ipfsToUrl } from "helpers/ipfs";
import { IconButton } from "components/icon-button";
import { Thumb } from "svg/thumb";

export default function Dashboard() {
  const [slot, setSlot] = useState<
    "yourPins" | "moonPins" | "moonBoards" | "settings"
  >("moonBoards");

  const getSlot = () => {
    switch (slot) {
      case "yourPins":
        return null;
      case "moonPins":
        return null;
      case "moonBoards":
        return <MoonboardSlot />;
      case "settings":
        return null;
    }
  };

  return (
    <main className="max-w-6xl mx-auto">
      <h1 className="my-12 text-center">Dashboard</h1>

      <div className="flex justify-between mb-16">
        <div className="flex gap-8">
          <TabBarItem
            currentSlot={slot}
            slot="moonBoards"
            onClick={() => setSlot("moonBoards")}
          >
            Moonboards
          </TabBarItem>
          <TabBarItem
            currentSlot={slot}
            slot="settings"
            onClick={() => setSlot("settings")}
          >
            Settings
          </TabBarItem>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-4 h-fit">
            <Filter>
              <FilterTab filter="pins" isDefault>
                <div className="flex items-center gap-2">
                  <p>Most Pins</p>
                  <Sort />
                </div>
              </FilterTab>
              <FilterTab filter="votes">
                <div className="flex items-center gap-2">
                  <p>Most Votes</p>
                  <Sort />
                </div>
              </FilterTab>
              <FilterTab filter="latest">
                <div className="flex items-center gap-2">
                  <p>Latest</p>
                  <Sort />
                </div>
              </FilterTab>
            </Filter>
          </div>
          <Link href="/create-moonboard">
            <Button>Create Moonboard</Button>
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">{getSlot()}</div>
    </main>
  );
}

type TabBarItemProps = {
  currentSlot: "yourPins" | "moonPins" | "moonBoards" | "settings";
  slot: "yourPins" | "moonPins" | "moonBoards" | "settings";
  onClick: () => void;
  children: React.ReactNode;
};

const TabBarItem = ({
  currentSlot,
  slot,
  onClick,
  children,
}: TabBarItemProps) => {
  const selected = currentSlot === slot;
  return (
    <button
      className={`bg-none  ${
        selected ? "font-bold border-b-4 border-b-primary-brand" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const MoonboardSlot = () => {
  const contractAddress =
    process.env.NEXT_PUBLIC_MOONBOARD_CONTRACT_ADDRESS ?? "";
  const { address } = useAccount();

  const { data, refetch: refetchMoonboards } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: MoonBoardABI.abi,
    functionName: "getMoonboards",
    args: [address],
  });

  const { writeAsync: deleteMoonboard } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: contractAddress as `0x${string}`,
    abi: MoonBoardABI.abi,
    functionName: "deleteMoonboard",
  });

  const onClickDeleteMoonboard = async (index: number) => {
    const sendTransactionResult = await deleteMoonboard({
      recklesslySetUnpreparedArgs: [index],
    });
    await sendTransactionResult.wait();
    await refetchMoonboards();
  };

  const moonboards = (data as any[]) ?? [];

  return (
    <div>
      {moonboards.map((moonboard, index) => (
        <div key={index} className="mb-8">
          <MoonBoard
            title={moonboard.name}
            moonpinIds={moonboard.moonpinIds.map((n: BigNumber) =>
              n.toNumber()
            )}
            votes={moonboard.votes.toNumber()}
            pins={0}
            onClickDelete={() => onClickDeleteMoonboard(index)}
            index={index}
          />
        </div>
      ))}
    </div>
  );
};

type MoonboardProps = {
  title: string;
  moonpinIds: number[];
  votes: number;
  pins: number;
  onClickDelete: () => void;
  index: number;
};

const MoonBoard = ({
  title,
  moonpinIds,
  votes,
  pins,
  index,
  onClickDelete,
}: MoonboardProps) => {
  const { address } = useAccount();

  return (
    <div className="border-2 border-outlines rounded-xl overflow-hidden">
      <div className="flex justify-between bg-black px-8">
        <Link href={`/moonboards/${address}/${index}`}>
          <h3 className="text-white">{title}</h3>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-white">Votes</p>
            <h3 className="text-white">
              {votes.toLocaleString("en-US", {
                minimumIntegerDigits: 3,
                useGrouping: false,
              })}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-white">Pins</p>
            <h3 className="text-white">
              {pins.toLocaleString("en-US", {
                minimumIntegerDigits: 3,
                useGrouping: false,
              })}
            </h3>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mx-8 my-8">
        <div className="flex gap-4">
          <h3>Creaated by:</h3>
          <p>You</p>
        </div>
        <div className="flex gap-2">
          <p className="">Total items</p>
          <h3 className="">
            {moonpinIds.length.toLocaleString("en-US", {
              minimumIntegerDigits: 3,
              useGrouping: false,
            })}
          </h3>
        </div>
      </div>

      <div className="mx-8">
        <Masonry
          breakpointCols={4}
          className="flex w-auto my-8"
          columnClassName="first:pl-0 pl-4"
        >
          {moonpinIds.map((moonpinId) => (
            <MoonpinCard key={moonpinId} moonpinId={moonpinId} />
          ))}
        </Masonry>
      </div>

      <div className="flex justify-end m-8">
        <Button onClick={onClickDelete}>Delete Moonboard</Button>
      </div>
    </div>
  );
};

type MoonpinCardProps = {
  moonpinId: number;
};

const MoonpinCard = ({ moonpinId }: MoonpinCardProps) => {
  // const votes = 0;
  const pins = 0;

  const contractAddress =
    process.env.NEXT_PUBLIC_MOONPIN_CONTRACT_ADDRESS ?? "";
  const { data: tokenUri, refetch: refetchMoonboards } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "tokenURI",
    args: [moonpinId],
  });

  const { data: moonpin } = useQuery({
    queryKey: ["moonpin", moonpinId],
    queryFn: async () => {
      const url = ipfsToUrl(tokenUri as string);
      const response = await fetch(url);
      const data = await response.json();
      data.image = ipfsToUrl(data.image);
      return data;
    },
  });

  const { data: votes, refetch: refetchVotes } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "getVotes",
    args: [moonpinId],
  });
  const voteCount = (votes as BigNumber)?.toNumber() ?? 0;

  const { config: voteConfig } = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "vote",
    args: [moonpinId],
    enabled: votes !== undefined && voteCount === 0,
  });
  const { writeAsync: vote } = useContractWrite(voteConfig);

  const onClickVote = async () => {
    const sendTransactionResult = await vote?.();
    await sendTransactionResult?.wait();

    refetchVotes();
  };

  const hasVoted = voteCount > 0;

  return (
    <div className="border-2 border-outlines rounded-2xl relative overflow-hidden mb-4">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={moonpin?.image} alt="" />
      </div>
      <div className="flex justify-between px-4 py-2">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <p className="">Votes</p>
            <h3 className="">
              {voteCount.toLocaleString("en-US", {
                minimumIntegerDigits: 3,
                useGrouping: false,
              })}
            </h3>
          </div>
          <div className="flex flex-col">
            <p className="">Pins</p>
            <h3 className="">
              {pins.toLocaleString("en-US", {
                minimumIntegerDigits: 3,
                useGrouping: false,
              })}
            </h3>
          </div>
        </div>
        <IconButton
          onClick={onClickVote}
          className={`bg-secondary-brand hover:bg-primary-brand hover:bg-black px-4 rounded-full
          ${hasVoted ? "bg-red-300 hover:bg-red-500" : ""}`}
        >
          <div className={`${hasVoted ? "rotate-180" : ""}`}>
            <Thumb />
          </div>
        </IconButton>
      </div>
    </div>
  );
};

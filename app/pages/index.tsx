import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { Input } from "components/input";
import { FilterTab, Filter } from "components/filter";
import { Button } from "components/button";
import { Star } from "svg/star";
import { useState } from "react";
import { Modal } from "components/modal";
import { IconButton } from "components/icon-button";
import { ModalOption } from "components/modal-option";
import Link from "next/link";
import { Close } from "svg/close";
import { Sort } from "svg/sort";
import { MoonBoardABI, MoonpinABI } from "contracts";
import { BigNumber } from "ethers";
import { Thumb } from "svg/thumb";
import { useQuery } from "@tanstack/react-query";
import { ipfsToUrl } from "helpers/ipfs";
import Masonry from "react-masonry-css";

export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const contractAddress =
    process.env.NEXT_PUBLIC_MOONBOARD_CONTRACT_ADDRESS ?? "";
  const { data, refetch: refetchMoonboards } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: MoonBoardABI.abi,
    functionName: "getAllMoonboards",
    args: [],
  });
  const allMoonboards = (data as any[]) ?? [];

  let index = 0;
  let prevOwner = allMoonboards[0]?.owner ?? "";
  let moonboardsWithIndexes: any[] = [];
  allMoonboards.forEach((moonboard) => {
    if (moonboard.owner !== prevOwner) {
      prevOwner = moonboard.owner;
      index = 0;
    }
    moonboardsWithIndexes.push({ ...moonboard, index });
  });

  // moonboardsWithIndexes = [
  //   ...moonboardsWithIndexes,
  //   ...moonboardsWithIndexes,
  //   ...moonboardsWithIndexes,
  //   ...moonboardsWithIndexes,
  //   ...moonboardsWithIndexes,
  //   ...moonboardsWithIndexes,
  // ];

  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  return (
    <main>
      <h1 className="m-12 text-center">Explore Moonboards</h1>

      <div className="flex items-center justify-between">
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
        <Button onClick={open}>Create Moonboard</Button>
      </div>

      <div className="grid sm:grid-cols-1 gap-4 md:grid-cols-3 mt-16">
        {moonboardsWithIndexes?.map((moonboard: any, key) => {
          return (
            <div key={key} className="">
              <Moonboard
                title={moonboard.name}
                votes={moonboard.votes}
                pins={0}
                owner={moonboard.owner}
                index={moonboard.index}
                moonpinIds={moonboard.moonpinIds.map((n: BigNumber) =>
                  n.toNumber()
                )}
              />
            </div>
          );
        })}
      </div>

      <Modal isOpen={showDialog} onDismiss={close}>
        <div className="m-4">
          <div className="flex justify-between">
            <div>
              <h3>Create Moonboard</h3>
              <p className="">
                Choose what content you want to put into your board
              </p>
            </div>

            <IconButton className="" onClick={close}>
              <Close />
            </IconButton>
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

type MoonboardProps = {
  title: string;
  votes: number;
  pins: number;
  owner: string;
  index: number;
  moonpinIds: number[];
};
const Moonboard = ({
  title,
  votes,
  pins,
  owner,
  index,
  moonpinIds,
}: MoonboardProps) => {
  return (
    <div className="border-2 border-outlines rounded-xl overflow-hidden max-h-[800px]">
      <div className="flex justify-between bg-black px-4 py-2">
        <Link href={`/moonboards/${owner}/${index}`}>
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
        <div className=""></div>
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
          breakpointCols={2}
          className="flex w-auto my-8"
          columnClassName="first:pl-0 pl-4"
        >
          {moonpinIds.map((moonpinId) => (
            <MoonpinCard key={moonpinId} moonpinId={moonpinId} />
          ))}
        </Masonry>
      </div>
    </div>
  );
};

type MoonpinCardProps = {
  moonpinId: number;
};

const MoonpinCard = ({ moonpinId }: MoonpinCardProps) => {
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
          className={`enabled:bg-primary-brand enabled:hover:bg-black enabled:px-4 enabled:rounded-full
          ${hasVoted ? "enabled:bg-red-500" : ""}`}
        >
          <div className={`${hasVoted ? "rotate-180" : ""}`}>
            <Thumb />
          </div>
        </IconButton>
      </div>
    </div>
  );
};

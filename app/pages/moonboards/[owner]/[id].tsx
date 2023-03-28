import { useQuery } from "@tanstack/react-query";
import { Filter, FilterTab } from "components/filter";
import { IconButton } from "components/icon-button";
import { PinSingleModal } from "components/pin-single-modal";
import { contracts } from "constants/contracts";
import { MoonBoardABI, MoonpinABI } from "contracts";
import { BigNumber } from "ethers";
import { formatTripleDigis } from "helpers/formatters";
import { ipfsToUrl } from "helpers/ipfs";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Masonry from "react-masonry-css";
import { Sort } from "svg/sort";
import { Thumb } from "svg/thumb";
import {
  useAccount,
  useChainId,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

export default function Moonboard() {
  const router = useRouter();
  const { owner, id } = router.query;

  const chainId = useChainId();
  const contractAddress = contracts[chainId].moonboardContract;

  const { data, refetch: refetchMoonboard } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: MoonBoardABI.abi,
    functionName: "getMoonboard",
    args: [owner, id],
  });

  const moonboard = data as any;
  const moonpinIds: any[] = moonboard?.moonpinIds ?? [];
  const externalMoonpinIds: any[] = moonboard?.externalMoonpinIds ?? [];
  const allMoonpins = [...moonpinIds, ...externalMoonpinIds];

  const numMoonPins = allMoonpins.length ?? 0;
  const numPins =
    (moonboard?.pins as BigNumber | undefined) ?? BigNumber.from(0);
  const numVotes =
    (moonboard?.votes as BigNumber | undefined) ?? BigNumber.from(0);

  const title = moonboard?.name ?? "";

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="max-w-6xl mx-auto">
        <h1 className="m-12 text-center">{title}</h1>

        <div className="flex items-center justify-between">
          <div></div>
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

        <div className="flex justify-between my-10 mx-auto">
          <div className="flex gap-4">
            <h3 className="font-bold">Created by:</h3>
            <p className="inline">{owner}</p>
          </div>

          <div className="flex gap-2">
            <p className="text-outlines">Votes</p>
            <h3>{formatTripleDigis(numVotes.toNumber())}</h3>
            <p className="text-outlines">Pins</p>
            <h3>{formatTripleDigis(numPins.toNumber())}</h3>
            <p className="text-outlines">Items</p>
            <h3>{formatTripleDigis(numMoonPins)}</h3>
          </div>
        </div>

        <div className="">
          <Masonry
            breakpointCols={4}
            className="flex w-auto my-8"
            columnClassName="first:pl-0 pl-4"
          >
            {allMoonpins.map((moonpinId: any) => (
              <MoonpinCard
                key={moonpinId}
                moonpinId={moonpinId}
                onVote={() => refetchMoonboard()}
                boardOwner={moonboard?.owner ?? ""}
              />
            ))}
          </Masonry>
        </div>
      </main>
    </>
  );
}

type MoonpinCardProps = {
  moonpinId: number;
  boardOwner: string;
  onVote: () => Promise<any>;
};

const MoonpinCard = ({ moonpinId, boardOwner, onVote }: MoonpinCardProps) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const moonpinContract = contracts[chainId].moonpinContract;
  const { data: tokenUri, refetch: refetchMoonboards } = useContractRead({
    address: moonpinContract as `0x${string}`,
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
    enabled: !!tokenUri,
  });

  const { data: voted, refetch: refetchVoted } = useContractRead({
    address: moonpinContract as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "getVoted",
    args: [address, moonpinId],
  });
  const hasVoted = (voted as boolean) ?? false;

  const { data: pinned, refetch: refetchPinned } = useContractRead({
    address: moonpinContract as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "getHasPinned",
    args: [address, moonpinId],
  });
  const hasPinned = (pinned as boolean) ?? false;

  const { data: votes, refetch: refetchVotes } = useContractRead({
    address: moonpinContract as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "getVotes",
    args: [moonpinId],
  });
  const voteCount = (votes as BigNumber)?.toNumber() ?? 0;

  const { data: pins, refetch: refetchPins } = useContractRead({
    address: moonpinContract as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "getPins",
    args: [moonpinId],
  });
  const pinCount = (pins as BigNumber)?.toNumber() ?? 0;

  const { config: voteConfig } = usePrepareContractWrite({
    address: moonpinContract as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "vote",
    args: [moonpinId],
    enabled: voted !== undefined && hasVoted === false,
  });
  const { writeAsync: vote } = useContractWrite(voteConfig);

  const { config: pinConfig } = usePrepareContractWrite({
    address: moonpinContract as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "pin",
    args: [moonpinId],
    enabled: pinned !== undefined && hasPinned === false,
  });
  const { writeAsync: pin } = useContractWrite(pinConfig);

  const { config: downvoteConfig } = usePrepareContractWrite({
    address: moonpinContract as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "downvote",
    args: [moonpinId],
    enabled: voted !== undefined && hasVoted === true,
  });
  const { writeAsync: downvote } = useContractWrite(downvoteConfig);

  const { config: unpinConfig } = usePrepareContractWrite({
    address: moonpinContract as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "unpin",
    args: [moonpinId],
    enabled: pinned !== undefined && hasPinned === true,
  });
  const { writeAsync: unpin } = useContractWrite(unpinConfig);

  const onClickVote = async () => {
    if (hasVoted) {
      const sendTransactionResult = await downvote?.();
      await sendTransactionResult?.wait();
    } else {
      const sendTransactionResult = await vote?.();
      await sendTransactionResult?.wait();
    }

    await refetchVotes();
    await refetchVoted();
    await onVote();
  };

  const onClickPin = async () => {
    if (hasPinned) {
      const sendTransactionResult = await unpin?.();
      await sendTransactionResult?.wait();
    } else {
      const sendTransactionResult = await pin?.();
      await sendTransactionResult?.wait();
    }

    refetchPins();
  };

  const [showPinModal, setShowPinModal] = useState(false);

  return (
    <div className="border-2 border-outlines rounded-2xl relative overflow-hidden mb-4">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={moonpin?.image} alt="" />
        <div className="absolute bottom-2 right-2">
          <IconButton
            onClick={() => setShowPinModal(true)}
            className="rounded-full hover:bg-transparent 
            hover:border-none border-none hover:scale-110 transition"
          >
            <Image
              src={"/images/moonboard-icon.png"}
              width={30}
              height={30}
              alt=""
            />
          </IconButton>
        </div>
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
              {pinCount.toLocaleString("en-US", {
                minimumIntegerDigits: 3,
                useGrouping: false,
              })}
            </h3>
          </div>
        </div>
        <IconButton
          onClick={onClickVote}
          className={`hover:bg-black px-4 rounded-full
          ${
            hasVoted
              ? "bg-red-300 hover:bg-red-500"
              : "bg-secondary-brand hover:bg-primary-brand"
          }`}
        >
          <div className={`${hasVoted ? "rotate-180" : ""}`}>
            <Thumb />
          </div>
        </IconButton>
      </div>

      <PinSingleModal
        isOpen={showPinModal}
        close={() => setShowPinModal(false)}
        title={moonpin?.title ?? ""}
        imageUrl={moonpin?.image ?? ""}
        moonpinId={moonpinId}
        boardOwner={boardOwner}
      />
    </div>
  );
};

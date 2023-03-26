import { useQuery } from "@tanstack/react-query";
import { Button } from "components/button";
import { Filter, FilterTab } from "components/filter";
import { IconButton } from "components/icon-button";
import { Modal } from "components/modal";
import { PinSingleModal } from "components/pin-single-modal";
import { MoonBoardABI, MoonpinABI } from "contracts";
import { BigNumber } from "ethers";
import { ipfsToUrl } from "helpers/ipfs";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Masonry from "react-masonry-css";
import { Close } from "svg/close";
import { Sort } from "svg/sort";
import { Thumb } from "svg/thumb";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

export default function Moonboard() {
  const router = useRouter();
  const { owner, id } = router.query;

  const contractAddress =
    process.env.NEXT_PUBLIC_MOONBOARD_CONTRACT_ADDRESS ?? "";

  const { data, refetch: refetchMoonboard } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: MoonBoardABI.abi,
    functionName: "getMoonboard",
    args: [owner, id],
  });

  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  const moonboard = data as any;
  const title = moonboard?.name ?? "";
  const moonpinIds = moonboard?.moonpinIds ?? [];

  return (
    <main>
      <h1 className="m-12 text-center">{title}</h1>

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

      <div className="flex justify-between my-16 mx-auto">
        <div className="flex gap-4">
          <h3 className="font-bold">Created by:</h3>
          <p className="inline">{owner}</p>
        </div>

        <div className="flex gap-2">
          <p className="text-outlines">Votes</p>
          <h3>000</h3>
          <p className="text-outlines">Pins</p>
          <h3>000</h3>
          <p className="text-outlines">Items</p>
          <h3>000</h3>
        </div>
      </div>

      <div className="">
        <Masonry
          breakpointCols={4}
          className="flex w-auto my-8"
          columnClassName="first:pl-0 pl-4"
        >
          {moonpinIds.map((moonpinId: any) => (
            <MoonpinCard key={moonpinId} moonpinId={moonpinId} />
          ))}
        </Masonry>
      </div>
    </main>
  );
}

type MoonpinCardProps = {
  moonpinId: number;
};

const MoonpinCard = ({ moonpinId }: MoonpinCardProps) => {
  const { address } = useAccount();
  const moonpinContract =
    process.env.NEXT_PUBLIC_MOONPIN_CONTRACT_ADDRESS ?? "";
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

    refetchVotes();
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
            className="enabled:rounded-full enabled:hover:bg-transparent 
          enabled:hover:border-none enabled:border-none enabled:hover:scale-110 transition"
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
          className={`enabled:bg-primary-brand enabled:hover:bg-black enabled:px-4 enabled:rounded-full
          ${hasVoted ? "enabled:bg-red-500" : ""}`}
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
      />
    </div>
  );
};

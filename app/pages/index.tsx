import {
  useAccount,
  useChainId,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { FilterTab, Filter } from "components/filter";
import { Button } from "components/button";
import { useState } from "react";
import { IconButton } from "components/icon-button";
import Link from "next/link";
import { Sort } from "svg/sort";
import { MoonBoardABI, MoonpinABI } from "contracts";
import { BigNumber } from "ethers";
import { Thumb } from "svg/thumb";
import { useQuery } from "@tanstack/react-query";
import { ipfsToUrl } from "helpers/ipfs";
import Masonry from "react-masonry-css";
import { formatTripleDigis } from "helpers/formatters";
import { CreateMoonboardTypeModal } from "components/create-moonboard-type-modal";
import { contracts } from "constants/contracts";
import Head from "next/head";
import { Footer } from "components/footer";

export default function Home() {
  const chainId = useChainId();
  const contractAddress = contracts[chainId].moonboardContract;
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
    index += 1;
  });

  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  return (
    <>
      <Head>
        <title>Moonboard</title>
      </Head>
      <main className="max-w-6xl mx-auto">
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

        <div className="grid sm:grid-cols-1 gap-4 md:grid-cols-2 mt-16">
          {moonboardsWithIndexes?.map((moonboard: any, key) => {
            const moonpinIds = moonboard.moonpinIds.map((n: BigNumber) =>
              n.toNumber()
            );
            const externalMoonpinIds = moonboard.externalMoonpinIds.map(
              (n: BigNumber) => n.toNumber()
            );

            return (
              <div key={key} className="">
                <Moonboard
                  title={moonboard.name}
                  votes={moonboard.votes.toNumber()}
                  pins={moonboard.pins.toNumber()}
                  owner={moonboard.owner}
                  index={moonboard.index}
                  moonpinIds={[...moonpinIds, ...externalMoonpinIds]}
                  refetch={refetchMoonboards}
                />
              </div>
            );
          })}
        </div>

        <CreateMoonboardTypeModal showDialog={showDialog} close={close} />
      </main>
      <Footer />
    </>
  );
}

type MoonboardProps = {
  title: string;
  votes: number;
  pins: number;
  owner: string;
  index: number;
  moonpinIds: number[];
  refetch: () => Promise<any>;
};
const Moonboard = ({
  title,
  votes,
  pins,
  owner,
  index,
  moonpinIds,
  refetch,
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
            <h3 className="text-white">{formatTripleDigis(votes)}</h3>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-white">Pins</p>
            <h3 className="text-white">{formatTripleDigis(pins)}</h3>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mx-4 my-8">
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

      <div className="mx-4">
        <Masonry
          breakpointCols={2}
          className="flex w-auto my-8"
          columnClassName="first:pl-0 pl-4"
        >
          {moonpinIds.map((moonpinId) => (
            <MoonpinCard
              key={moonpinId}
              moonpinId={moonpinId}
              onVote={refetch}
            />
          ))}
        </Masonry>
      </div>
    </div>
  );
};

type MoonpinCardProps = {
  moonpinId: number;
  onVote: () => Promise<any>;
};

const MoonpinCard = ({ moonpinId, onVote }: MoonpinCardProps) => {
  const pins = 0;

  const chainId = useChainId();
  const contractAddress = contracts[chainId].moonpinContract;
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
    enabled: !!tokenUri,
  });

  const { address } = useAccount();

  const { data: votes, refetch: refetchVotes } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "getVotes",
    args: [moonpinId],
  });
  const voteCount = (votes as BigNumber)?.toNumber() ?? 0;

  const { data: voted, refetch: refetchVoted } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "getVoted",
    args: [address, moonpinId],
  });
  const hasVoted = (voted as boolean | undefined) ?? false;

  const { config: voteConfig } = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "vote",
    args: [moonpinId],
    enabled: voted !== undefined && hasVoted === false,
  });
  const { writeAsync: vote } = useContractWrite(voteConfig);

  const { config: downvoteConfig } = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "downvote",
    args: [moonpinId],
    enabled: voted !== undefined && hasVoted === true,
  });
  const { writeAsync: downvote } = useContractWrite(downvoteConfig);

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

  return (
    <>
      <div className="border-2 border-outlines rounded-2xl relative overflow-hidden mb-4">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={moonpin?.image} alt="" />
        </div>
        <div className="flex justify-between px-4 py-2">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <p className="">Votes</p>
              <h3 className="">{formatTripleDigis(voteCount)}</h3>
            </div>
            <div className="flex flex-col">
              <p className="">Pins</p>
              <h3 className="">{formatTripleDigis(pins)}</h3>
            </div>
          </div>
          <IconButton
            onClick={onClickVote}
            className={`hover:bg-black px-4 rounded-full 
          ${
            hasVoted
              ? "bg-red-300 enabled:hover:bg-red-500"
              : "bg-secondary-brand hover:bg-primary-brand"
          }`}
          >
            <div className={`${hasVoted ? "rotate-180" : ""}`}>
              <Thumb />
            </div>
          </IconButton>
        </div>
      </div>
    </>
  );
};

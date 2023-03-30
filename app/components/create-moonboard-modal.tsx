import { Close } from "svg/close";
import { IconButton } from "./icon-button";
import { Modal } from "./modal";
import Image from "next/image";
import {
  useAccount,
  useChainId,
  useContractRead,
  useContractWrite,
} from "wagmi";
import { MoonBoardABI } from "contracts";
import { BigNumber, ethers } from "ethers";
import { Button } from "./button";
import { useState } from "react";
import { MoonPin } from "pages/create-moonboard";
import { NFTStorage } from "nft.storage";
import { contracts } from "constants/contracts";
import { NavigationButton } from "./navigation-button";

const nftStorageClient = new NFTStorage({
  token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN ?? "",
});

type CreateMoonboardModalProps = {
  isOpen: boolean;
  close: () => void;
  name: string;
  moonPins: MoonPin[];
};
export const CreateMoonboardModal = ({
  isOpen,
  close,
  name,
  moonPins,
}: CreateMoonboardModalProps) => {
  const chainId = useChainId();
  const contractAddress = contracts[chainId].moonboardContract;
  const { address } = useAccount();

  const { data: createBoardFeeResult } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: MoonBoardABI.abi,
    functionName: "createBoardFee",
    args: [],
  });

  const createBoardFee =
    (createBoardFeeResult as BigNumber | undefined) ?? BigNumber.from(0);

  const { data: pinFeeResult } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: MoonBoardABI.abi,
    functionName: "pinFee",
    args: [],
  });

  const numPins = moonPins.filter((moonPin) => moonPin.selected).length;
  const pinFee = (pinFeeResult as BigNumber | undefined) ?? BigNumber.from(0);
  const totalPinFee = pinFee.mul(numPins);

  const totalFee = createBoardFee.add(totalPinFee);

  const [loadingState, setLoadingState] = useState<"initial" | "ipfs" | "mint">(
    "initial"
  );

  const loadingStateString = {
    ipfs: "Uploading to IPFS",
    mint: "Confirm in wallet...",
    initial: "Publish Moonboard",
  }[loadingState];

  const { writeAsync: onCreateMoonboard } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: contractAddress as `0x${string}`,
    abi: MoonBoardABI.abi,
    functionName: "createMoonboard(string,string[])",
  });

  const { refetch: refetchMoonboards } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: MoonBoardABI.abi,
    functionName: "getMoonboards",
    args: [address],
  });

  const [successful, setSuccessful] = useState(false);

  const onSubmit = async () => {
    setSuccessful(false);
    setLoadingState("ipfs");

    const metadata = await Promise.all(
      moonPins.map(async (moonPin) => {
        if (moonPin.selected) {
          return nftStorageClient.store({
            name: moonPin.name,
            description: "",
            image: moonPin.imageFile,
          });
        }
      })
    );
    const tokenUris = metadata.map((token) => token?.url ?? "");

    setLoadingState("mint");

    const sendTransactionResult = await onCreateMoonboard?.({
      recklesslySetUnpreparedArgs: [name, tokenUris],
      recklesslySetUnpreparedOverrides: {
        value: totalFee,
      },
    });
    await sendTransactionResult?.wait();

    const moonboards = await refetchMoonboards();

    setLoadingState("initial");
    setSuccessful(true);
  };

  return (
    <Modal isOpen={isOpen} onDismiss={close}>
      <div className="m-4">
        <div className="flex justify-between mb-4">
          <div></div>
          <IconButton className="" onClick={close}>
            <Close />
          </IconButton>
        </div>

        <div className="flex gap-4">
          <div className="w-full">
            <Image
              className="mb-4"
              width="112"
              height="30"
              alt=""
              src="/images/logo.png"
            />
            <p className="font-bold text-lg">Publish Moonboard</p>
            <p className="text-sm">
              In order to create your moonboard you need to pay for each Moonpin
              you have created and a fee for creating the Moonboard
            </p>
          </div>
          <div className="w-full">
            <p className="text-sm mt-4">Moonboard Fee</p>
            <div className="flex justify-between">
              <h3 className="text-gray-500">{name}</h3>
              <h3 className="">
                {ethers.utils
                  .formatEther(createBoardFee.toString() ?? "0")
                  .toString()}
                ETH
              </h3>
            </div>

            <p className="text-sm mt-4">Moonpin Fees</p>
            <div className="flex justify-between">
              <h3 className="text-gray-500">Pins (x{numPins})</h3>
              <h3 className="">
                {ethers.utils
                  .formatEther(totalPinFee.toString() ?? "0")
                  .toString()}
                ETH
              </h3>
            </div>

            <div className="flex justify-between text-primary-brand mt-4">
              <h3 className="">Total</h3>
              <h3 className="">
                {ethers.utils
                  .formatEther(
                    createBoardFee.add(totalPinFee).toString() ?? "0"
                  )
                  .toString()}
                ETH
              </h3>
            </div>

            <div className="flex justify-between mt-4">
              <div />
              <div>
                {!successful ? (
                  <Button
                    onClick={onSubmit}
                    disabled={!["initial"].includes(loadingState)}
                  >
                    {loadingStateString}
                  </Button>
                ) : (
                  <NavigationButton href="/dashboard">
                    Dashboard
                  </NavigationButton>
                )}
                {successful && <p className="text-right mt-2">Success!</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

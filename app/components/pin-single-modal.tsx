import { Close } from "svg/close";
import { IconButton } from "./icon-button";
import { Modal } from "./modal";
import Image from "next/image";
import { Button } from "./button";
import { Select } from "./select";
import {
  useAccount,
  useChainId,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { MoonBoardABI } from "contracts";
import { useState } from "react";
import { NavigationButton } from "./navigation-button";
import { BigNumber } from "ethers";
import { contracts } from "constants/contracts";

type PinSingleModalProps = {
  isOpen: boolean;
  close: () => void;
  title?: string;
  imageUrl: string;
  moonpinId: number;
  boardOwner: string;
};
export const PinSingleModal = ({
  isOpen,
  close,
  title = "",
  imageUrl,
  moonpinId,
  boardOwner,
}: PinSingleModalProps) => {
  const chainId = useChainId();
  const moonboardContract = contracts[chainId].moonboardContract;
  const { address } = useAccount();

  const { data: pinFeeResult, refetch: refetchFee } = useContractRead({
    address: moonboardContract as `0x${string}`,
    abi: MoonBoardABI.abi,
    functionName: "pinFee",
    args: [],
  });
  const pinFee = (pinFeeResult as BigNumber | undefined) ?? BigNumber.from(0);

  const { data, refetch: refetchMoonboards } = useContractRead({
    address: moonboardContract as `0x${string}`,
    abi: MoonBoardABI.abi,
    functionName: "getMoonboards",
    args: [address],
  });
  const moonboards = (data as any[]) ?? [];
  const moonboardNames = moonboards.map((moonboard) => moonboard.name);
  moonboardNames.push("Create new moonboard...");
  const [selectedMoonboard, setSelectedMoonboard] = useState("");

  const { config: pinConfig } = usePrepareContractWrite({
    address: moonboardContract as `0x${string}`,
    abi: MoonBoardABI.abi,
    functionName: "pinToBoard",
    args: [boardOwner, moonpinId, Number(selectedMoonboard)],
    enabled: selectedMoonboard !== "",
    overrides: {
      value: pinFee,
    },
  });
  const { writeAsync: onPinToBoard } = useContractWrite(pinConfig);

  const [stage, setStage] = useState<"pin" | "payment" | "complete">("pin");

  const onClickPay = async () => {
    const sendTransactionResult = await onPinToBoard?.();
    await sendTransactionResult?.wait();
    setStage("complete");
  };

  const onDismiss = () => {
    close();
    setStage("pin");
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <div className="m-4">
        <div className="flex justify-between mb-4">
          <div></div>
          <IconButton className="" onClick={close}>
            <Close />
          </IconButton>
        </div>

        <div className="flex gap-4">
          <div className="border-2 border-outlines rounded-lg w-full overflow-hidden">
            <div className="bg-white py-2 px-4 h-8 flex items-center">
              <h3 className="">{title === "" ? "No title" : title}</h3>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" />
            <div className="bg-white py-2 px-4 h-8 flex items-center">
              <Select
                onChange={(e) => setSelectedMoonboard(e.target.value)}
                value={selectedMoonboard}
                options={moonboardNames}
                defaultOption="Select a moonboard"
              />
            </div>
          </div>

          {stage === "pin" && <Pin onClickPin={() => setStage("payment")} />}
          {stage === "payment" && <Payment onClickPayment={onClickPay} />}
          {stage === "complete" && <Complete />}
        </div>
      </div>
    </Modal>
  );
};

type PinProps = {
  onClickPin: () => void;
};
const Pin = ({ onClickPin }: PinProps) => {
  return (
    <div className="w-full">
      <Image
        className="mb-4"
        width="112"
        height="30"
        alt=""
        src="/images/logo.png"
      />
      <p className="font-bold text-lg">Pin moonpin</p>
      <p className="">
        You can pin this Moonpin or choose to pin many (coming soon!).
      </p>
      <Button onClick={onClickPin} className="my-8">
        Pin it
      </Button>
    </div>
  );
};

type PaymentProps = {
  onClickPayment: () => void;
};
const Payment = ({ onClickPayment }: PaymentProps) => {
  const pinFee = 0.0001;
  return (
    <div className="w-full">
      <Image
        className="mb-4"
        width="112"
        height="30"
        alt=""
        src="/images/logo.png"
      />
      <p className="font-bold text-lg">Pin fee</p>
      <div className="text-primary-brand flex justify-between font-headers mt-4">
        <p className="">1 Pin</p>
        <p>{pinFee} ETH</p>
      </div>
      <div className=" flex justify-between font-headers mt-4">
        <p className="">Total</p>
        <p>{pinFee} ETH</p>
      </div>
      <Button onClick={onClickPayment} className="my-8">
        Continue
      </Button>
      <p className="">
        All pin fees are sent to the pin creator (75%) and the mooner who
        curated this board (25%)
      </p>
    </div>
  );
};

type CompleteProps = {};
const Complete = ({}: CompleteProps) => {
  return (
    <div className="w-full">
      <Image
        className="mb-4"
        width="112"
        height="30"
        alt=""
        src="/images/logo.png"
      />
      <p className="font-bold text-lg">Well done pinning!</p>
      <p className="my-4">Go see all your boards or continue pinning</p>
      <NavigationButton href="/dashboard">See Boards</NavigationButton>
    </div>
  );
};

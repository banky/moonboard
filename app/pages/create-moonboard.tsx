import { Button } from "components/button";
import { Checkbox } from "components/checkbox";
import { IconButton } from "components/icon-button";
import { NavigationButton } from "components/navigation-button";
import { useRouter } from "next/router";
import { NFTStorage } from "nft.storage";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Plus } from "svg/plus";
import Masonry from "react-masonry-css";
import { Check } from "svg/check";
import { Close } from "svg/close";
import { PlusCross } from "svg/plus-cross";
import { MoonBoardABI, MoonpinABI } from "contracts";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
} from "wagmi";
import { BigNumber } from "ethers";
import { CreateMoonboardModal } from "components/create-moonboard-modal";

const fileTypes = ["JPG", "JPEG", "PNG", "GIF"];

export default function CreateMoonboard() {
  const [files, setFiles] = useState<File[]>([]);

  const [pageState, setPageState] = useState<"upload" | "publish">("upload");

  return pageState === "upload" ? (
    <Upload files={files} setFiles={setFiles} setPageState={setPageState} />
  ) : (
    <Publish files={files} setPageState={setPageState} />
  );
}

type UploadProps = {
  files: File[];
  setFiles: (files: File[]) => void;
  setPageState: (pageState: "upload" | "publish") => void;
};
const Upload = ({ files, setFiles, setPageState }: UploadProps) => {
  const [myPictures, setMyPictures] = useState(false);
  const [communityGuidelines, setCommunityGuidelines] = useState(false);

  const handleChange = (files: FileList) => {
    setFiles(Array.from(files));
  };

  return (
    <main>
      <h1 className="m-12 text-center">Create Moonboard</h1>

      <div className="flex justify-between my-32 max-w-6xl mx-auto">
        <NavigationButton href="/">Back</NavigationButton>

        <Button
          onClick={() => {
            setPageState("publish");
          }}
        >
          Continue
        </Button>
      </div>

      <div className="border-2 border-outlines rounded-md max-w-6xl mx-auto">
        <div className="m-4">
          <h3>Upload Pictures to create you Moonboard</h3>
          <p className="">
            Choose what content you want to put into your board
          </p>
        </div>

        <div className="h-0.5 bg-outlines my-4" />

        <div className="w-3/4 mx-auto mb-8 flex gap-4 items-center">
          <div className="grow">
            <FileUploader
              handleChange={handleChange}
              name="file"
              types={fileTypes}
              multiple
            >
              <div className="border-outlines border-2 border-dashed min-h-[128px] py-4 rounded-md flex items-center justify-center">
                {files.length === 0 ? (
                  <p className="my-auto">Drag and drop</p>
                ) : (
                  <div className="flex flex-col">
                    {files.map((file) => (
                      <p key={file.name} className="">
                        {file.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </FileUploader>
          </div>
        </div>

        <div className="w-3/4 mx-auto mb-8">
          <Checkbox
            id="my-pictures"
            checked={myPictures}
            label="These pictures are mine"
            onChange={(e) => setMyPictures(e.target.checked)}
          />
          <Checkbox
            id="community-guidelines"
            checked={communityGuidelines}
            label="I have read community guidelines"
            onChange={(e) => setCommunityGuidelines(e.target.checked)}
          />
        </div>
      </div>
    </main>
  );
};

type PublishProps = {
  files: File[];
  setPageState: (pageState: "upload" | "publish") => void;
};

export type MoonPin = {
  name: string;
  imageFile: File;
  selected: boolean;
};

const Publish = ({ files, setPageState }: PublishProps) => {
  const [enteringTitle, setEnteringTitle] = useState(false);
  const [moonboardName, setMoonboardName] = useState("");
  const showPlaceholder = !enteringTitle && moonboardName === "";

  const [moonPins, setMoonPins] = useState<MoonPin[]>(
    files.map((file) => ({
      name: "",
      imageFile: file,
      selected: true,
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main>
      <div className="m-12 text-center relative h-20">
        <input
          className="placeholder:font-bold placeholder:text-primary-brand w-full
         bg-background font-headers absolute top-0 left-0 bottom-0 p-4 outline-none text-5xl
         text-center"
          onFocus={() => setEnteringTitle(true)}
          onBlur={() => setEnteringTitle(false)}
          value={moonboardName}
          onChange={(e) => setMoonboardName(e.target.value)}
        />
        {showPlaceholder ? (
          <div className="flex items-center justify-center p-4">
            <h1 className="relative pointer-events-none pl-2 pr-1 w-fit">
              MOONBOARD NAME
            </h1>
            <div className="w-0.5 h-10 mb-2 relative bg-black invisible animate-blink" />
          </div>
        ) : null}
      </div>

      <div className="flex justify-between my-32 max-w-6xl mx-auto">
        <Button onClick={() => setPageState("upload")}>Back</Button>

        <Button onClick={() => setIsModalOpen(true)}>Publish Moonboard</Button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between">
          <div>
            <h3 className="font-bold">Your New Moonpins</h3>
            <p className="inline">
              Select which ones to keep and unselect which ones to exclude from
              your board
            </p>
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

        <Masonry
          breakpointCols={4}
          className="flex w-auto my-8"
          columnClassName="first:pl-0 pl-4"
        >
          {moonPins.map((moonpin) => (
            <MoonpinCard
              key={moonpin.imageFile.name}
              image={URL.createObjectURL(moonpin.imageFile)}
              title={moonpin.name}
              selected={moonpin.selected}
              onSelectedChange={(selected: boolean) => {
                setMoonPins((prev) =>
                  prev.map((pin) =>
                    pin.imageFile.name === moonpin.imageFile.name
                      ? { ...pin, selected }
                      : pin
                  )
                );
              }}
              onTitleChange={(title: string) => {
                setMoonPins((prev) =>
                  prev.map((pin) =>
                    pin.imageFile.name === moonpin.imageFile.name
                      ? { ...pin, name: title }
                      : pin
                  )
                );
              }}
            />
          ))}
        </Masonry>
      </div>

      <CreateMoonboardModal
        isOpen={isModalOpen}
        close={() => setIsModalOpen(false)}
        name={moonboardName}
        moonPins={moonPins}
      />
    </main>
  );
};

type MoonpinCardProps = {
  image: string;
  title: string;
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
  onTitleChange: (title: string) => void;
};

const MoonpinCard = ({
  image,
  title,
  selected,
  onSelectedChange,
  onTitleChange,
}: MoonpinCardProps) => {
  const [enteringTitle, setEnteringTitle] = useState(false);
  const showPlaceholder = !enteringTitle && title === "";

  return (
    <div className="border-2 border-outlines rounded-2xl relative overflow-hidden mb-4">
      <div className="px-2 relative w-full h-12 flex items-center">
        <input
          className="placeholder:font-bold placeholder:text-primary-brand w-full
         bg-background font-headers absolute top-0 left-0 bottom-0 p-4 outline-none"
          onFocus={() => setEnteringTitle(true)}
          onBlur={() => setEnteringTitle(false)}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        {showPlaceholder ? (
          <div className="flex items-center">
            <h1 className="text-lg text-primary-brand relative pointer-events-none pl-2 pr-1 w-fit">
              ITEM NAME
            </h1>
            <div className="w-0.5 h-5 mb-1 relative bg-primary-brand invisible animate-blink" />
          </div>
        ) : null}
      </div>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" />
      </div>
      <div className="absolute bottom-2 right-2">
        {selected ? (
          <IconButton
            onClick={() => onSelectedChange(!selected)}
            className="bg-white enabled:px-2 enabled:rounded-full"
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => onSelectedChange(!selected)}
            className="enabled:bg-primary-brand enabled:px-2 enabled:rounded-full enabled:hover:bg-text-standard"
          >
            <PlusCross />
          </IconButton>
        )}
      </div>
    </div>
  );
};

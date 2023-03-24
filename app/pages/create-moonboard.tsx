import { Button } from "components/button";
import { Checkbox } from "components/checkbox";
import { IconButton } from "components/icon-button";
import { NavigationButton } from "components/navigation-button";
import { useRouter } from "next/router";
import { NFTStorage } from "nft.storage";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Plus } from "svg/plus";
import Masonry from "react-masonry-css";
import { Check } from "svg/check";

const fileTypes = ["JPG", "JPEG", "PNG", "GIF"];

const nftStorageClient = new NFTStorage({
  token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN ?? "",
});

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
  const submitEnabled = myPictures && communityGuidelines && files.length > 0;

  const handleChange = (files: FileList) => {
    console.log("files", files);
    setFiles(Array.from(files));
  };

  return (
    <main>
      <h1 className="m-12 text-center">Create Moonboard</h1>

      <div className="flex justify-between my-8">
        <NavigationButton href="/">Back</NavigationButton>

        <Button
          onClick={() => {
            setPageState("publish");
          }}
          disabled={!submitEnabled}
        >
          Continue
        </Button>
      </div>

      <div className="border-2 border-outlines rounded-md max-w-2xl mx-auto">
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
const Publish = ({ files, setPageState }: PublishProps) => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);

    const file = files[0];

    const metadata = await nftStorageClient.store({
      name: "test moonpin 2",
      description: "This is a test",
      image: file,
    });

    console.log("metadata", metadata);

    setLoading(false);

    // router.push("/publish-moonboard");
  };

  return (
    <main>
      <h1 className="m-12 text-center">Publish Moonboard</h1>
      <div className="flex justify-between my-8">
        <Button onClick={() => setPageState("upload")}>Back</Button>

        <Button onClick={onSubmit} loading={loading}>
          Publish Moonboard
        </Button>
      </div>

      <div className="border-2 border-outlines rounded-md p-4">
        <div className="flex justify-between">
          <p className="font-bold">Your New Created Moonpins</p>
          <p>
            {files.length} item{`${files.length > 1 ? "s" : ""}`}
          </p>
        </div>

        <Masonry
          breakpointCols={4}
          className="flex w-auto my-8"
          columnClassName="first:pl-0 pl-4"
        >
          {files.map((file) => (
            <CreateMoonboardCard
              key={file.name}
              image={URL.createObjectURL(file)}
              title=""
            />
          ))}
        </Masonry>
      </div>
    </main>
  );
};

type CreateMoonboardCardProps = {
  image: string;
  title: string;
};

const CreateMoonboardCard = ({ image, title }: CreateMoonboardCardProps) => {
  const [enteringTitle, setEnteringTitle] = useState(false);

  return (
    <div className="border-2 border-outlines rounded-2xl relative overflow-hidden mb-4">
      <div className="px-2 relative w-full h-12 flex items-center">
        <input
          className="placeholder:font-bold placeholder:text-primary-brand w-full
         bg-background font-headers absolute top-0 left-0 bottom-0 p-4 outline-none"
          onFocus={() => setEnteringTitle(true)}
          onBlur={() => setEnteringTitle(false)}
        />
        {!enteringTitle ? (
          <div className="flex items-center">
            {/* <h1 className="text-lg text-primary-brand relative pointer-events-none px-2 w-fit">
              ITEM NAME
            </h1> */}
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
        <IconButton className="bg-white rounded-full px-2">
          <Check />
        </IconButton>
      </div>
    </div>
  );
};

import { Button } from "components/button";
import { Checkbox } from "components/checkbox";
import { IconButton } from "components/close-button";
import { NavigationButton } from "components/navigation-button";
import { useRouter } from "next/router";
import { NFTStorage } from "nft.storage";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Plus } from "svg/plus";

const fileTypes = ["JPG", "PNG", "GIF"];

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
              <div className="border-outlines border-2 border-dashed h-32 rounded-md flex items-center justify-center">
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
    </main>
  );
};

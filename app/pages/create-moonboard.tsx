import { Checkbox } from "components/checkbox";
import { IconButton } from "components/close-button";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Plus } from "svg/plus";

const fileTypes = ["JPG", "PNG", "GIF"];

export default function CreateMoonboard() {
  const [files, setFiles] = useState<File[]>([]);
  const [myPictures, setMyPictures] = useState(false);
  const [communityGuidelines, setCommunityGuidelines] = useState(false);

  const submitEnabled = myPictures && communityGuidelines && files.length > 0;

  const handleChange = (files: FileList) => {
    setFiles(Array.from(files));
  };

  return (
    <main>
      <h1 className="m-12 text-center">Create Moonboard</h1>

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

          <div>
            <IconButton disabled={!submitEnabled}>
              <Plus />
            </IconButton>
          </div>
        </div>

        <div className="w-3/4 mx-auto">
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
}

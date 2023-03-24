import { IconButton } from "components/close-button";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Plus } from "svg/plus";

const fileTypes = ["JPG", "PNG", "GIF"];

export default function CreateMoonboard() {
  const [files, setFiles] = useState<File[]>([]);

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
            <IconButton>
              <Plus />
            </IconButton>
          </div>
        </div>

        <div className="w-3/4 mx-auto">
          <input
            id="my-pictures"
            type="checkbox"
            value=""
            className="appearance-none w-4 h-4 text-blue-600 bg-gray-100 border-2 border-outlines rounded 
            focus:ring-blue-500 focus:ring-2 checked:bg-slate-200
            hover:drop-shadow-[5px_5px_0_rgba(30,30,30,1)]"
          />
          <label htmlFor="my-pictures" className="mx-4">
            These pictures are mine
          </label>
          <br />
          <input
            id="community-guidelines"
            type="checkbox"
            value=""
            className="appearance-none w-4 h-4 text-blue-600 bg-gray-100 border-2 border-outlines rounded 
            focus:ring-blue-500 focus:ring-2 checked:bg-slate-200
            hover:drop-shadow-[5px_5px_0_rgba(30,30,30,1)]"
          />
          <label htmlFor="community-guidelines" className="mx-4">
            I have read community guidelines
          </label>
        </div>
      </div>
    </main>
  );
}

import { Button } from "components/button";
import { Input } from "components/input";
import { MoonpinABI } from "contracts";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { Web3Storage } from "web3.storage";

const fileTypes = ["JPG", "PNG", "GIF"];

const web3StorageClient = new Web3Storage({
  token: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN ?? "",
});

export default function CreateMoonpin() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const contractAddress =
    process.env.NEXT_PUBLIC_MOONPIN_CONTRACT_ADDRESS ?? "";
  const { address } = useAccount();

  const { config } = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi: MoonpinABI.abi,
    functionName: "mint",
    args: [address],
  });
  const { writeAsync: onMint } = useContractWrite(config);

  const [file, setFile] = useState<any>(null);
  const handleChange = (file: any) => {
    setFile(file);
  };

  const handleUpload = async () => {
    if (file == null) {
      return;
    }
    const cid = await web3StorageClient.put([file]);

    const sendTransactionResult = await onMint?.();
    await sendTransactionResult?.wait();
  };

  return (
    <main className="text-center">
      <h1 className="my-8">Create Moonpin</h1>

      <div className="w-fit mx-auto mb-8">
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          label="Upload an image"
        />
      </div>
      <div className="flex flex-col gap-4 max-w-lg mx-auto">
        <Input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button onClick={handleUpload}>Create</Button>
      </div>
    </main>
  );
}

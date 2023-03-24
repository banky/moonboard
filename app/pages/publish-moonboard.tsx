import { Button } from "components/button";
import { NavigationButton } from "components/navigation-button";
import { NFTStorage } from "nft.storage";
import { useState } from "react";

const nftStorageClient = new NFTStorage({
  token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN ?? "",
});

export default function PublishMoonboard() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);

    setLoading(false);
  };

  return (
    <main className="text-center">
      <h1 className="my-8">Publish Moonboard</h1>
      <div className="flex justify-between my-8">
        <NavigationButton href="/">Back</NavigationButton>

        <Button loading={loading} onClick={onSubmit}>
          Publish Moonboard
        </Button>
      </div>
    </main>
  );
}

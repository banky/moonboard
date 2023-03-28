type Contracts = {
  moonpinContract: string;
  moonboardContract: string;
};

export const contracts: { [chainID: number]: Contracts } = {
  // Scroll Alpha
  534353: {
    moonpinContract: "0xbA1C6eEAd2Ad7C833Bd51D66D30d1e55c25248cd",
    moonboardContract: "0xdEcA5e0f2876E2A6332c16817052fBe3b898386c",
  },
  // Hardhat
  31337: {
    moonpinContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    moonboardContract: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
  // Polygon ZK EVM
  1442: {
    moonpinContract: "0xdEcA5e0f2876E2A6332c16817052fBe3b898386c",
    moonboardContract: "0x92e354a6fff1D5AAcf3394dAd75C587b63CFDa19",
  },
  // Optimism
  420: {
    moonpinContract: "0xbA1C6eEAd2Ad7C833Bd51D66D30d1e55c25248cd",
    moonboardContract: "0xdEcA5e0f2876E2A6332c16817052fBe3b898386c",
  },
  // Gnosis
  10200: {
    moonpinContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    moonboardContract: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
};

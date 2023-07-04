import { Alchemy, Network } from "alchemy-sdk";
import { useState } from "react";

import "./App.css";
import EthereumAddressInput from "./EthereumAddressInput";
import BlockHashInput from "./BlockHashInput";
import BlockDataDisplay from "./BlockDataDisplay";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  // const [blockNumber, setBlockNumber] = useState();

  // useEffect(() => {
  //   async function getBlockNumber() {
  //     setBlockNumber(await alchemy.core.getBlockNumber());
  //   }

  //   getBlockNumber();
  // });

  const [blockData, setBlockData] = useState(null);

  const fetchBlockData = async (blockHash) => {
    const block = await alchemy.core.getBlockWithTransactions(blockHash);
    setBlockData(block);
  };

  return (
    <>
      <div>
        <BlockHashInput onFetchBlock={fetchBlockData} />
        <BlockDataDisplay blockData={blockData} />
      </div>
      <div>
        <EthereumAddressInput alchemy={alchemy}></EthereumAddressInput>
      </div>
    </>
  );
}

export default App;

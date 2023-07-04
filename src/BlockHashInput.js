import React, { useState } from "react";

const BlockHashInput = ({ onFetchBlock }) => {
  const [blockHash, setBlockHash] = useState("");

  const handleInputChange = (event) => {
    setBlockHash(event.target.value);
  };

  const handleInputEnter = (event) => {
    if (event.key === "Enter") {
      onFetchBlock(blockHash);
    }
  };

  const handleButtonClick = () => {
    onFetchBlock(blockHash);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter block hash or tag (e.g. latest)"
        value={blockHash}
        size="50"
        onChange={handleInputChange}
        onKeyPress={handleInputEnter}
      />
      <button onClick={handleButtonClick}>Fetch Block Data</button>
    </div>
  );
};

export default BlockHashInput;

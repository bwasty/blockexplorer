import React from "react";

const BlockDataDisplay = ({ blockData }) => {
  if (!blockData) return null;

  return (
    <div>
      <h2>Block Data</h2>
      <pre>{JSON.stringify(blockData, null, 2)}</pre>
    </div>
  );
};

export default BlockDataDisplay;

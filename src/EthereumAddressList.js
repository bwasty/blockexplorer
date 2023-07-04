import React from "react";

const EthereumAddressList = ({ addressBundle, ensMapping, onDelete }) => {
  return (
    <ul>
      {addressBundle.map((address, index) => (
        <li key={index}>
          {address}
          {ensMapping[address] && ` (${ensMapping[address]})`}
          <button
            onClick={() => onDelete(address)}
            style={{ "margin-left": "10px" }}
          >
            x
          </button>
        </li>
      ))}
    </ul>
  );
};

export default EthereumAddressList;

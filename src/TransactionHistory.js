import React, { useState, useEffect, useRef } from "react";
import { Utils } from "alchemy-sdk";

const TransactionHistory = ({ addressBundle, ensMapping, alchemy }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const transactionsRef = useRef({});

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchTransactions = async () => {
      for (const address of addressBundle) {
        if (!transactionsRef.current[address]) {
          try {
            // from
            transactionsRef.current[address] =
              await alchemy.core.getAssetTransfers({
                fromBlock: "0x0",
                fromAddress: address,
                category: [
                  "external",
                  "internal",
                  "erc20",
                  "erc721",
                  "erc1155",
                ],
              });
            // to
            transactionsRef.current[address].transfers.push(
              await alchemy.core.getAssetTransfers({
                fromBlock: "0x0",
                toAddress: address,
                category: [
                  "external",
                  "internal",
                  "erc20",
                  "erc721",
                  "erc1155",
                ],
              })
            );
            // balance
            transactionsRef.current[address].balance =
              await alchemy.core.getBalance(address);
          } catch (err) {
            setError(err.message);
            setLoading(false);
            return;
          }
        }
      }

      setLoading(false);
    };

    fetchTransactions();
  }, [addressBundle, alchemy.core]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Address</th>
          <th>ENS Name</th>
          <th>Balance</th>
          <th>Transactions</th>
        </tr>
      </thead>
      <tbody>
        {addressBundle.map((address, index) => (
          <tr key={index}>
            <td>{address}</td>
            <td>{ensMapping[address] || "N/A"}</td>
            <td>
              {transactionsRef.current[address]
                ? Utils.formatUnits(
                    transactionsRef.current[address].balance,
                    "ether"
                  ).slice(0, 6) + " ETH"
                : "N/A"}
            </td>
            <td>
              {transactionsRef.current[address]
                ? transactionsRef.current[address].transfers.length
                : "N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionHistory;

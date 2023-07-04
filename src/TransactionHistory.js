import React, { useState, useEffect } from "react";

const TransactionHistory = ({ addressBundle, ensMapping, alchemy }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState({});

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchTransactions = async () => {
      const newTransactions = { ...transactions };

      for (const address of addressBundle) {
        if (!newTransactions[address]) {
          try {
            newTransactions[address] = await alchemy.core.getAssetTransfers({
              fromAddress: address,
            });
          } catch (err) {
            setError(err.message);
            setLoading(false);
            return;
          }
        }
      }

      setTransactions(newTransactions);
      setLoading(false);
    };

    fetchTransactions();
  }, [addressBundle, alchemy, transactions]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Address</th>
          <th>ENS Name</th>
          <th>Transactions</th>
        </tr>
      </thead>
      <tbody>
        {addressBundle.map((address, index) => (
          <tr key={index}>
            <td>{address}</td>
            <td>{ensMapping[address] || "N/A"}</td>
            <td>
              {transactions[address] ? transactions[address].length : "N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionHistory;

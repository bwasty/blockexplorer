import React, { useState, useEffect } from "react";
import { getAddress } from "ethers";
import EthereumAddressList from "./EthereumAddressList";
import TransactionHistory from "./TransactionHistory";

const validateAddress = async (address, provider) => {
  try {
    // If the address ends with '.eth', it's an ENS name
    if (address.endsWith(".eth")) {
      // Use ethers.js to resolve the ENS name to an address
      const resolvedAddress = await provider.resolveName(address);
      if (resolvedAddress) {
        return { address: resolvedAddress, ensName: address };
      } else {
        throw new Error("ENS name could not be resolved");
      }
    } else {
      // If it's not an ENS name, normalize and validate it as an Ethereum address
      return { address: getAddress(address) };
    }
  } catch {
    return false;
  }
};

const processAddress = async (
  address,
  setAddressBundle,
  ensMapping,
  setEnsMapping,
  provider
) => {
  let validatedAddress = await validateAddress(address, provider);
  if (!validateAddress) {
    alert("Invalid Ethereum address");
    return;
  }

  // TODO!: should be from state, not localStorage, right?
  const addressBundle = JSON.parse(localStorage.getItem("addressBundle")) || [];
  addressBundle.push(validatedAddress.address);

  localStorage.setItem("addressBundle", JSON.stringify(addressBundle));
  setAddressBundle(addressBundle);

  if (validatedAddress.ensName) {
    const newEnsMapping = { ...ensMapping };
    newEnsMapping[validatedAddress.address] = validatedAddress.ensName;
    localStorage.setItem("ensMapping", JSON.stringify(newEnsMapping));
    setEnsMapping(newEnsMapping);
  }

  const url = new URL(window.location);
  url.searchParams.set("addresses", addressBundle.join(","));
  window.history.pushState({}, "", url);
};

const EthereumAddressInput = ({ alchemy }) => {
  const [address, setAddress] = useState("");
  const [addressBundle, setAddressBundle] = useState(() => {
    const storedBundle = localStorage.getItem("addressBundle");
    return storedBundle ? JSON.parse(storedBundle) : [];
  });

  const [ensMapping, setEnsMapping] = useState(() => {
    const storedMapping = localStorage.getItem("ensMapping");
    return storedMapping ? JSON.parse(storedMapping) : {};
  });

  const handleInputChange = (event) => {
    setAddress(event.target.value);
  };

  const handleInputEnter = async (event) => {
    if (event.key === "Enter") {
      processAddress(
        address,
        setAddressBundle,
        ensMapping,
        setEnsMapping,
        await alchemy.config.getProvider()
      );
      setAddress("");
    }
  };

  const handleButtonClick = async () => {
    processAddress(
      address,
      setAddressBundle,
      ensMapping,
      setEnsMapping,
      await alchemy.config.getProvider()
    );
    setAddress("");
  };

  useEffect(() => {
    const url = new URL(window.location);
    url.searchParams.set("addresses", addressBundle.join(","));
    window.history.pushState({}, "", url);
  }, [addressBundle]);

  const handleDelete = (addressToDelete) => {
    const newAddressBundle = addressBundle.filter(
      (address) => address !== addressToDelete
    );
    localStorage.setItem("addressBundle", JSON.stringify(newAddressBundle));
    setAddressBundle(newAddressBundle);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Ethereum address or ENS name"
        value={address}
        size="50"
        onChange={handleInputChange}
        onKeyPress={handleInputEnter}
      />
      <button onClick={handleButtonClick}>+</button>
      <EthereumAddressList
        addressBundle={addressBundle}
        ensMapping={ensMapping}
        onDelete={handleDelete}
      />
      <TransactionHistory
        addressBundle={addressBundle}
        ensMapping={ensMapping}
        alchemy={alchemy}
      />
    </div>
  );
};

export default EthereumAddressInput;

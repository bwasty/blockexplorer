import React, { useState, useEffect } from 'react';
import { getAddress } from 'ethers';

const validateAddress = async (address, provider) => {
  try {
    // If the address ends with '.eth', it's an ENS name
    if (address.endsWith('.eth')) {
      // Use ethers.js to resolve the ENS name to an address
      const resolvedAddress = await provider.resolveName(address);
      if (resolvedAddress) {
        return resolvedAddress;
      } else {
        throw new Error('ENS name could not be resolved');
      }
    } else {
      // If it's not an ENS name, normalize and validate it as an Ethereum address
      return getAddress(address);
    }
  } catch {
    return false;
  }
};


const processAddress = async (address, setAddressBundle, provider) => {
  address = await validateAddress(address, provider);
  if (!address) {
    alert('Invalid Ethereum address');
    return;
  }

  const addressBundle = JSON.parse(localStorage.getItem('addressBundle')) || [];
  addressBundle.push(address);

  localStorage.setItem('addressBundle', JSON.stringify(addressBundle));
  setAddressBundle(addressBundle);

  const url = new URL(window.location);
  url.searchParams.set('addresses', addressBundle.join(','));
  window.history.pushState({}, '', url);
};

const EthereumAddressInput = ({ alchemy }) => {
  const [address, setAddress] = useState('');
  const [addressBundle, setAddressBundle] = useState(() => {
    const storedBundle = localStorage.getItem('addressBundle');
    return storedBundle ? JSON.parse(storedBundle) : [];
  });

  const handleInputChange = (event) => {
    setAddress(event.target.value);
  };

  const handleInputEnter = async (event) => {
    if(event.key === 'Enter') {
      processAddress(address, setAddressBundle, await alchemy.config.getProvider());
      setAddress('');
    }
  };

  const handleButtonClick = async () => {
    processAddress(address, setAddressBundle, await alchemy.config.getProvider());
    setAddress('');
  };

  useEffect(() => {
    const url = new URL(window.location);
    url.searchParams.set('addresses', addressBundle.join(','));
    window.history.pushState({}, '', url);
  }, [addressBundle]);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Ethereum address or ENS name"
        value={address}
        onChange={handleInputChange}
        onKeyPress={handleInputEnter}
      />
      <button onClick={handleButtonClick}>
        +
      </button>
    </div>
  );
};

export default EthereumAddressInput;

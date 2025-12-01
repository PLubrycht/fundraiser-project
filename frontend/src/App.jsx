import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./config";

import CreateFundraiser from "./components/CreateFundraiser";
import FundraiserList from "./components/FundraiserList";

function App() {
  const [contract, setContract] = useState(null);
  const [fundraisers, setFundraisers] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const prov = new ethers.BrowserProvider(window.ethereum);

          const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            await prov.getSigner()
          );
          setContract(contractInstance);
        } catch (err) {
          console.error("Error initializing contract", err);
        }
      } else {
        console.warn("Metamask not found in browser!");
      }
    };
    init();
  }, []);

  const loadFundraisers = async () => {
    if (!contract) return;
    try {
      const data = await contract.getFundraisers();
      setFundraisers(data);
    } catch (err) {
      console.error("Error loading fundraisers:", err);
    }
  };

  useEffect(() => {
    if (contract) {
      loadFundraisers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  return (
    <div className="app-wrapper">
      <h1>Fundraiser DApp</h1>

      <CreateFundraiser contract={contract} refresh={loadFundraisers} />
      <FundraiserList
        fundraisers={fundraisers}
        contract={contract}
        refresh={loadFundraisers}
      />
    </div>
  );
}

export default App;

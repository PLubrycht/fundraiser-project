import { useState } from "react";
import { ethers } from "ethers";

export default function FundraiserCard({ id, f, contract, refresh }) {
  const [donateAmount, setDonateAmount] = useState("");

  const percent = (Number(f.totalCollected) / Number(f.goal)) * 100;

  async function donate() {
    if (!contract) return alert("Contract still loading!");
    try {
      const tx = await contract.donate(id, {
        value: ethers.parseEther(donateAmount),
      });
      await tx.wait();
      refresh();
      setDonateAmount("");
    } catch (err) {
      console.error("Donation rror:", err);
      alert("SOmething went wrong");
    }
  }

  async function withdraw() {
    if (!contract) return alert("Contract still loading.");
    try {
      const tx = await contract.withdraw(id);
      await tx.wait();
      refresh();
    } catch (err) {
      console.error("Withdrawn error:", err);
      alert("Thats not nice to steal You ******");
    }
  }

  return (
    <div className="card">
      <h3>{f.name}</h3>
      <p>{f.description}</p>
      <p>
        Zebrano: {ethers.formatEther(f.totalCollected)} /{" "}
        {ethers.formatEther(f.goal)} ETH ({percent.toFixed(0)}%)
      </p>

      <div className="progress-wrapper">
        <div className="progress-bar" style={{ width: `${percent}%` }}></div>
      </div>

      {f.active ? (
        <>
          <input
            placeholder="Donate (ETH)"
            value={donateAmount}
            onChange={(e) => setDonateAmount(e.target.value)}
          />
          <button onClick={donate}>Donate</button>

          {percent >= 100 && <button onClick={withdraw}>Withdraw</button>}
        </>
      ) : (
        <p>Fundraiser finished.</p>
      )}
    </div>
  );
}

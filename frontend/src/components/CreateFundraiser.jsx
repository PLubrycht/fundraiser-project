import { useState } from "react";
import { ethers } from "ethers";

export default function CreateFundraiser({ contract, refresh }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [goal, setGoal] = useState("");

  async function create() {
    if (!contract) return alert("Contract sill loading !");

    try {
      const tx = await contract.createFundraiser(
        name,
        desc,
        ethers.parseEther(goal)
      );
      await tx.wait();
      refresh();

      setName("");
      setDesc("");
      setGoal("");
    } catch (err) {
      console.error("Error occured while creating a fundraiser:", err);
      alert("Something went wrong, check the console");
    }
  }

  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>Create Fundraiser</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <br />
      <input
        placeholder="Target (ETH)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <br />
      <button onClick={create}>Add</button>
    </div>
  );
}

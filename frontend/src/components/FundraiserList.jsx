import FundraiserCard from "./FundraiserCard";

export default function FundraiserList({ fundraisers, contract, refresh }) {
  return (
    <div>
      <h2>List of Fundraisers</h2>

      {fundraisers.length === 0 && <p>There are no fundraisers.</p>}

      {fundraisers.map((f, i) => (
        <FundraiserCard
          key={i}
          id={i}
          f={f}
          contract={contract}
          refresh={refresh}
        />
      ))}
    </div>
  );
}

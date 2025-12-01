const hre = require("hardhat");

async function main() {
  const Manager = await hre.ethers.deployContract("FundraiserManager");
  await Manager.waitForDeployment();

  console.log("FundraiserManager deployed at:", Manager.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import hre, { ethers } from "hardhat";

async function main() {
  const MockSwap = await ethers.getContractFactory("MockSwap");
  const mockSwap = await MockSwap.deploy(
    "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
    {
      gasLimit: 10000000,
    }
  );

  await mockSwap.waitForDeployment();
  console.log("MockSwap deployed to:", await mockSwap.getAddress());

  const GamePoolMaster = await ethers.getContractFactory("GamePoolMaster");
  const gamePoolMaster = await GamePoolMaster.deploy(
    "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
    await mockSwap.getAddress()
  );
  console.log("GamePoolMaster deployed to:", await gamePoolMaster.getAddress());
}

// const verify = async (contract: {
//   address: any;

//   deployTransaction: { args: any };
// }) => {
//   await hre.run("verify:verify", {
//     address: contract.address,
//     constructorArguments: contract.deployTransaction.args,
//   });
// };

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

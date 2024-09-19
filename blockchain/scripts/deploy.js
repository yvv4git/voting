const { ethers } = require("hardhat");

async function main() {
    const VotingList = await ethers.getContractFactory("VotingList");
    const votingList = await VotingList.deploy();
    await votingList.waitForDeployment();

    console.log("VotingList deployed to:", await votingList.getAddress());
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
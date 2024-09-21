const { ethers } = require("hardhat");

// Run:
// npx hardhat run --network localHardhat scripts/deploy.js
async function main() {
    // Получаем все кошельки
    const signers = await ethers.getSigners();

    // Выбираем второй кошелек (индекс 1)
    const deployer = signers[1];

    console.log("Deploying contracts with the account:", deployer.address);

    const commission = ethers.parseUnits("0.001", "ether");
    console.log("Cmmission: ", commission);
    const VotingList = await ethers.getContractFactory("VotingList", deployer);
    const votingList = await VotingList.deploy({
        gasPrice: commission, // Цена газа
    });
    await votingList.waitForDeployment();

    console.log("VotingList deployed to:", await votingList.getAddress());
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
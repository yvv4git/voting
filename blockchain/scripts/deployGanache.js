const { ethers } = require("hardhat");

async function main() {
    // Получаем провайдер и подписываем транзакции с помощью приватного ключа
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

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
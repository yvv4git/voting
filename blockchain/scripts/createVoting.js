const { ethers } = require("hardhat");

// Run:
// npx hardhat run --network localHardhat scripts/createVoting.js
async function main() {
    const [user1] = await ethers.getSigners();

    // Адрес развернутого контракта (замените на реальный адрес)
    const contractAddress = "0x8464135c8F25Da09e49BC8782676a84730C318bC";

    // Подключение к уже развернутому контракту
    const VotingList = await ethers.getContractFactory("VotingList");
    const contractVotingList = await VotingList.attach(contractAddress);

    // Создание голосования
    const votingName = "Test Voting";
    const finishAt = Math.floor(Date.now() / 1000) + 60; // Завершение через 1 минуту
    const options = ["Option 1", "Option 2", "Option 3"];
    const commission = ethers.parseEther("0.1"); // 0.1 ETH

    await contractVotingList.createVoting(votingName, finishAt, options, commission, { value: commission });

    console.log("Voting created");
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
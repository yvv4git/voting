const { ethers } = require("hardhat");

async function main() {
    const [user1] = await ethers.getSigners();

    // Развертывание контракта
    const VotingList = await ethers.getContractFactory("VotingList");
    const contractVotingList = await VotingList.deploy();
    await contractVotingList.waitForDeployment();

    console.log("Contract deployed to:", await contractVotingList.getAddress());

    // Подписка на событие DebugLog
    contractVotingList.on("DebugLog", (message, value, event) => {
        console.log(`DebugLog: ${message}, Value: ${value}`);
    });

    // Создание голосования
    const votingName = "Test Voting";
    const finishAt = Math.floor(Date.now() / 1000) + 60; // Завершение через 1 мин
    const options = ["Option 1", "Option 2", "Option 3"];
    const commission = ethers.parseEther("0.1"); // 0.1 ETH

    await contractVotingList.createVoting(votingName, finishAt, options, commission, { value: commission });

    console.log("Voting created");

    // Голосование
    const votingId = 0;
    const optionId = 1;
    const voteAmount = ethers.parseEther("0.01"); // 0.01 ETH

    await contractVotingList.vote(votingId, optionId, { value: voteAmount });

    console.log("Voted");

    // Получение результатов голосования
    const votes = await contractVotingList.getVotes(votingId);
    console.log("Votes:", votes);
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
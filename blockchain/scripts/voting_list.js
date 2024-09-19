const { ethers } = require("hardhat");

async function main() {
    const [user1] = await ethers.getSigners();

    // Развертывание контракта
    const VotingList = await ethers.getContractFactory("VotingList");
    const contractVotingList = await VotingList.deploy();
    await contractVotingList.waitForDeployment();

    console.log("Contract deployed to:", await contractVotingList.getAddress());

    // Создание голосования
    const votingName = "Test Voting";
    const finishAt = Math.floor(Date.now() / 1000) + 3; // Завершение через 3 секунды
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
    const voting = await contractVotingList.votings(votingId);
    console.log(`Voting Name: ${voting.name}`);
    console.log("Votes:", votes);

    // Добавляем задержку в 4 секунды перед удалением голосования
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Удаление голосования
    try {
        await contractVotingList.deleteVoting(votingId);
        console.log("Voting deleted");
    } catch (error) {
        console.error("Error deleting voting:", error.message);
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
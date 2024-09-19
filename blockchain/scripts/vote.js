const { ethers } = require("hardhat");

async function main() {
    const [user1] = await ethers.getSigners();

    // Адрес развернутого контракта (замените на реальный адрес)
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // Подключение к уже развернутому контракту
    const VotingList = await ethers.getContractFactory("VotingList");
    const contractVotingList = await VotingList.attach(contractAddress);

    // Голосование
    const votingId = 0;
    const optionId = 1;
    const voteAmount = ethers.parseEther("0.01"); // 0.01 ETH

    await contractVotingList.vote(votingId, optionId, { value: voteAmount });

    console.log("Voted");
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
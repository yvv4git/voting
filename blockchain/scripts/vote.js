const { ethers } = require("hardhat");

async function main() {
    const [user1] = await ethers.getSigners();

    // Адрес развернутого контракта (замените на реальный адрес)
    const contractAddress = "0x8464135c8F25Da09e49BC8782676a84730C318bC";

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
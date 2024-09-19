import { ethers } from "hardhat";

async function main() {
    const [user1] = await ethers.getSigners();

    // Адрес развернутого контракта (замените на реальный адрес)
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // Подключение к уже развернутому контракту
    const VotingList = await ethers.getContractFactory("VotingList");
    const contractVotingList = await VotingList.attach(contractAddress);

    // Удаление голосования
    const votingId = 0;

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
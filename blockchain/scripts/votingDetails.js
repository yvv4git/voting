const { ethers } = require("hardhat");

// Run:
// npx hardhat run --network localHardhat scripts/votingDetails.js
async function main() {
    const [user1] = await ethers.getSigners();

    // Адрес развернутого контракта (замените на реальный адрес)
    const contractAddress = "0x8464135c8F25Da09e49BC8782676a84730C318bC";

    // Подключение к уже развернутому контракту
    const VotingList = await ethers.getContractFactory("VotingList");
    const contractVotingList = await VotingList.attach(contractAddress);

    // ID голосования, для которого нужно получить детали
    const votingId = 0;

    // Получение детальной информации о голосовании
    const votingDetails = await contractVotingList.getVotingDetails(votingId);

    // Вывод информации о голосовании в консоль
    console.log("");
    console.log("VOTING DETAILS.");
    console.log(`Voting ID: ${votingDetails.id}`);
    console.log(`Name: ${votingDetails.name}`);

    // Явно преобразуем BigInt в число перед умножением
    const finishAtTimestamp = Number(votingDetails.finishAt) * 1000;
    console.log(`Finish At: ${new Date(finishAtTimestamp).toLocaleString()}`);

    console.log(`Is Deleted: ${votingDetails.isDeleted}`);

    console.log("");
    console.log("OPTIONS.");
    for (let i = 0; i < votingDetails.options.length; i++) {
        const option = votingDetails.options[i];
        console.log(`Option ID: ${i}`);
        console.log(`Option Name: ${option.name}`);
        console.log(`Points: ${option.points}`);
        console.log("-----------------------------");
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
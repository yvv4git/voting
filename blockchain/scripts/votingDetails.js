const { ethers } = require("hardhat");

// Run:
// npx hardhat run --network localHardhat scripts/votingDetails.js
async function main() {
    const signers = await ethers.getSigners();
    const user3 = signers[0];

    // Проверяем, что третий пользователь существует
    if (!user3) {
        console.error("Третий пользователь не найден.");
        return;
    }

    // Вывод адреса кошелька user3
    console.log(`User3 address: ${user3.address}`);

    // Адрес развернутого контракта (замените на реальный адрес)
    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

    // Подключение к уже развернутому контракту
    const VotingList = await ethers.getContractFactory("VotingList");
    const contractVotingList = await VotingList.attach(contractAddress);

    // ID голосования, для которого нужно получить детали
    const votingId = 0;

    // Получение детальной информации о голосовании от имени user3
    const votingDetails = await contractVotingList.connect(user3).getVotingDetails(votingId);

    // Вывод информации о голосовании в консоль
    console.log("");
    console.log("VOTING DETAILS.");
    console.log(`Voting ID: ${votingDetails.id}`);
    console.log(`Name: ${votingDetails.name}`);

    // Явно преобразуем BigInt в число перед умножением
    const finishAtTimestamp = Number(votingDetails.finishAt) * 1000;
    console.log(`Finish At: ${new Date(finishAtTimestamp).toLocaleString()}`);

    console.log(`Is Deleted: ${votingDetails.isDeleted}`);
    console.log(`Voted: ${votingDetails.voted}`); // Вывод значения voted

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
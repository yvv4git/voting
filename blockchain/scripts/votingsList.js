const { ethers } = require("hardhat");

// Run:
// npx hardhat run --network localHardhat scripts/votingsList.js
async function main() {
    const signers = await ethers.getSigners();
    const user3 = signers[2];

    // Проверяем, что третий пользователь существует
    if (!user3) {
        console.error("Третий пользователь не найден.");
        return;
    }

    // Вывод адреса кошелька user3
    console.log(`User3 address: ${user3.address}`);

    // Адрес развернутого контракта (замените на реальный адрес)
    const contractAddress = "0x8464135c8F25Da09e49BC8782676a84730C318bC";

    // Подключение к уже развернутому контракту
    const VotingList = await ethers.getContractFactory("VotingList");
    const contractVotingList = await VotingList.attach(contractAddress);

    // Получаем список всех голосований от имени user3
    const votings = await contractVotingList.connect(user3).getAllVotings();

    // Выводим информацию о каждом голосовании в консоль
    console.log("List of votings:");
    for (let i = 0; i < votings.length; i++) {
        const voting = votings[i];
        console.log(`Voting ID: ${voting.id}`);
        console.log(`Name: ${voting.name}`);

        // Явно преобразуем BigInt в число перед умножением
        const finishAtTimestamp = Number(voting.finishAt) * 1000;
        console.log(`Finish At: ${new Date(finishAtTimestamp).toLocaleString()}`);

        console.log(`Is Deleted: ${voting.isDeleted}`);
        console.log("-----------------------------");
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
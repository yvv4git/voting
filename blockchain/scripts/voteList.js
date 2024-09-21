const { ethers } = require("hardhat");

async function main() {
    const [user1] = await ethers.getSigners();

    // Адрес развернутого контракта (замените на реальный адрес)
    const contractAddress = "0x8464135c8F25Da09e49BC8782676a84730C318bC";

    // Подключение к уже развернутому контракту
    const VotingList = await ethers.getContractFactory("VotingList");
    const contractVotingList = await VotingList.attach(contractAddress);

    // Получение количества голосований
    const votingsCount = await contractVotingList.votingsCount();
    console.log(`Total votings: ${votingsCount}`);

    // Перебор всех голосований и вывод информации о них
    for (let i = 0; i < votingsCount; i++) {
        const voting = await contractVotingList.votings(i);
        console.log(`Voting ID: ${i}`);
        console.log(`Name: ${voting.name}`);
        console.log(`Finish At: ${new Date(Number(voting.finishAt) * 1000).toLocaleString()}`);

        // Проверка на существование commission
        if (voting.commission !== undefined) {
            console.log(`Commission: ${ethers.formatEther(voting.commission)} ETH`);
        } else {
            console.log(`Commission: Not available`);
        }

        console.log(`Deleted At: ${voting.deleted_at > 0 ? new Date(Number(voting.deleted_at) * 1000).toLocaleString() : 'Not deleted'}`);
        console.log(`Options Count: ${voting.optionsCount}`);

        // Получение количества голосов для каждой опции
        const votes = await contractVotingList.getVotes(i);

        // Вывод информации о каждой опции
        for (let j = 0; j < voting.optionsCount; j++) {
            const option = await contractVotingList.getOption(i, j);
            console.log(`  Option ID: ${j}`);
            console.log(`  Option Name: ${option.name}`);
            console.log(`  Points: ${votes[j]}`);
        }

        console.log('-----------------------------------');
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
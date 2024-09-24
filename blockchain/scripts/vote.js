const { ethers } = require("hardhat");

// Run:
// npx hardhat run --network localHardhat scripts/vote.js
async function main() {
    const signers = await ethers.getSigners();
    const user3 = signers[2];

    // Проверяем, что третий пользователь существует
    if (!user3) {
        console.error("Третий пользователь не найден.");
        return;
    }

    // Адрес развернутого контракта
    const contractAddress = "0x8464135c8F25Da09e49BC8782676a84730C318bC";

    // Подключение к уже развернутому контракту
    const VotingList = await ethers.getContractFactory("VotingList");
    const contractVotingList = await VotingList.attach(contractAddress);

    // Голосование от имени user3
    const votingId = 0;
    const optionId = 1;
    const voteAmount = ethers.parseEther("0.01"); // 0.01 ETH

    // Вызываем метод контракта от имени user3
    await contractVotingList.connect(user3).vote(votingId, optionId, { value: voteAmount });

    console.log("Voted");
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
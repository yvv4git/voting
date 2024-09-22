<template>
  <div class="wallet-connect">
    <button @click="connectWallet">Connect a wallet</button>
    <button @click="createVoting">Create Voting</button>
    <button @click="voteInVoting">Vote in Voting</button>
    <button @click="deleteVoting">Delete Voting</button>
    <button @click="getAllVotings">Get all votings</button>
    <button @click="getVotingDetails">Get voting details</button>
  </div>
</template>

<script>
import Web3 from "web3";
import { votingListABI, contractAddress } from "./contracts/votingList";

export default {
  name: "WalletConnect",
  data() {
    return {
      web3: null,
      contract: null,
      accounts: [],
    };
  },
  methods: {
    async connectWallet() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          this.web3 = new Web3(window.ethereum);
          this.accounts = await this.web3.eth.getAccounts();
          console.log("Connected accounts:", this.accounts);

          // Подключаемся к контракту
          this.contract = new this.web3.eth.Contract(votingListABI, contractAddress);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.error("MetaMask is not installed");
      }
    },
    async createVoting() {
      if (!this.contract) {
        console.error("Contract is not initialized");
        return;
      }

      try {
        const name = "Voting 1";
        const finishAt = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
        const options = ["Option 1", "Option 2", "Option 3"];
        const commission = 1000000000000000; // 0.001 ETH - сколко требовать денег за создание голосования

        // Получаем текущий nonce для аккаунта
        const nonce = await this.web3.eth.getTransactionCount(this.accounts[0]);
        console.log("Nonce:", nonce);

        // Определяем gasLimit автоматически
        const gasLimitBigInt = await this.contract.methods
          .createVoting(name, finishAt, options, commission)
          .estimateGas({
            from: this.accounts[0],
            value: commission,
          });

        // Преобразуем BigInt в обычное число
        const gasLimit = Number(gasLimitBigInt);
        console.log("Gas limit:", gasLimit);

        // Вызываем функцию контракта
        await this.contract.methods
          .createVoting(name, finishAt, options, commission)
          .send({
            from: this.accounts[0],
            value: commission, // Если функция payable, передаем значение
            gasPrice: Web3.utils.toWei("1", "gwei"), // Укажите цену газа
            gasLimit: gasLimit, // Укажите лимит газа
            nonce: nonce, // Укажите nonce
          });

        console.log("Voting created successfully");
      } catch (error) {
        console.error("Error creating voting:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
    },
    async voteInVoting() {
      if (!this.contract) {
        console.error("Contract is not initialized");
        return;
      }

      try {
        const votingId = 0; // Укажите ID голосования
        const optionId = 2; // Укажите ID варианта
        const value = Web3.utils.toWei("0.001", "ether"); // Укажите сумму для голосования

        // Получаем текущий nonce для аккаунта
        const nonce = await this.web3.eth.getTransactionCount(this.accounts[0]);

        // Определяем gasLimit автоматически
        const gasLimitBigInt = await this.contract.methods
          .vote(votingId, optionId)
          .estimateGas({
            from: this.accounts[0],
            value: value,
          });

        // Преобразуем BigInt в обычное число
        const gasLimit = Number(gasLimitBigInt);
        console.log("Gas limit:", gasLimit);

        // Вызываем функцию контракта
        await this.contract.methods.vote(votingId, optionId).send({
          from: this.accounts[0],
          value: value, // Если функция payable, передаем значение
          gasPrice: Web3.utils.toWei("1", "gwei"), // Укажите цену газа
          gasLimit: gasLimit, // Укажите лимит газа
          nonce: nonce, // Укажите nonce
        });

        console.log("Voted successfully");
      } catch (error) {
        console.error("Error voting:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
    },
    async deleteVoting() {
      if (!this.contract) {
        console.error("Contract is not initialized");
        return;
      }

      try {
        const votingId = 0; // Укажите ID голосования

        // Получаем текущий nonce для аккаунта
        const nonce = await this.web3.eth.getTransactionCount(this.accounts[0]);

        // Определяем gasLimit автоматически
        const gasLimitBigInt = await this.contract.methods
          .deleteVoting(votingId)
          .estimateGas({
            from: this.accounts[0],
          });

        // Преобразуем BigInt в обычное число
        const gasLimit = Number(gasLimitBigInt);
        console.log("Gas limit:", gasLimit);

        // Вызываем функцию контракта
        await this.contract.methods.deleteVoting(votingId).send({
          from: this.accounts[0],
          gasPrice: Web3.utils.toWei("1", "gwei"), // Укажите цену газа
          gasLimit: gasLimit, // Укажите лимит газа
          nonce: nonce, // Укажите nonce
        });

        console.log("Voting deleted successfully");
      } catch (error) {
        console.error("Error deleting voting:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
    },
    async getAllVotings() {
      if (!this.contract) {
        console.error("Contract is not initialized");
        return;
      }

      try {
        // Получаем список всех голосований
        const votings = await this.contract.methods.getAllVotings().call();

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
      } catch (error) {
        console.error("Error getting all votings:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
    },
    async getVotingDetails() {
      if (!this.contract) {
        console.error("Contract is not initialized");
        return;
      }

      try {
        const votingId = 0; // Укажите ID голосования

        // Получаем детальную информацию о голосовании
        const votingDetails = await this.contract.methods.getVotingDetails(votingId).call();

        // Выводим информацию о голосовании в консоль
        console.log("");
        console.log("Voting Details:");
        console.log(`Voting ID: ${votingDetails.id}`);
        console.log(`Name: ${votingDetails.name}`);

        // Явно преобразуем BigInt в число перед умножением
        const finishAtTimestamp = Number(votingDetails.finishAt) * 1000;
        console.log(`Finish At: ${new Date(finishAtTimestamp).toLocaleString()}`);

        console.log(`Is Deleted: ${votingDetails.isDeleted}`);

        console.log("Options:");
        for (let i = 0; i < votingDetails.options.length; i++) {
          const option = votingDetails.options[i];
          console.log(`Option ID: ${i}`);
          console.log(`Option Name: ${option.name}`);
          console.log(`Points: ${option.points}`);
          console.log("-----------------------------");
        }
      } catch (error) {
        console.error("Error getting voting details:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
    },
  },
};
</script>

<style scoped>
.wallet-connect {
  margin-bottom: 0px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  margin-right: 10px; /* Добавляем отступ между кнопками */
}
button:hover {
  background-color: #3a5168;
}
</style>
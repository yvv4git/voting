<template>
  <div class="voting-details" v-if="selectedVoting">
    <h2>{{ selectedVoting.name }}</h2>
    <p>Finish At: {{ formatDate(selectedVoting.finishAt) }}</p>
    <p>Is Deleted: {{ selectedVoting.isDeleted ? 'Yes' : 'No' }}</p>
    <ul>
      <li v-for="(option, index) in selectedVoting.options" :key="index">
        {{ option.name }} - {{ option.points }} number of votes
        <button @click="voteForOption(index)" v-if="!selectedVoting.voted">Vote</button>
      </li>
    </ul>
  </div>
  <div v-else class="no-voting-selected">
    <p>Select the vote on the left to see the details.</p>
  </div>
</template>

<script>
import Web3 from "web3";
import { votingListABI, contractAddress } from "./contracts/votingList";

export default {
  name: "VotingDetails",
  props: {
    selectedVotingId: {
      type: Number,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      selectedVoting: null,
      web3: null,
      contract: null,
      accounts: [],
    };
  },
  methods: {
    async connectWallet() {
      console.log("Connecting to MetaMask...");
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
    async fetchVotingDetails(votingId) {
      if (!this.contract) {
        console.error("Contract is not initialized");
        return;
      }

      try {
        // Получаем детальную информацию о голосовании
        const votingDetails = await this.contract.methods.getVotingDetails(votingId).call();
        console.log("Voting Details:", votingDetails);

        // Преобразуем данные в удобный формат
        this.selectedVoting = {
          id: votingDetails.id,
          name: votingDetails.name,
          finishAt: Number(votingDetails.finishAt) * 1000, // Преобразуем BigInt в число и в миллисекунды
          isDeleted: votingDetails.isDeleted,
          options: votingDetails.options.map(option => ({
            name: option.name,
            points: option.points,
          })),
          voted: votingDetails.voted, // Добавляем флаг voted
        };
      } catch (error) {
        console.error("Error fetching voting details:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
    },
    async voteForOption(index) {
      if (!this.contract) {
        console.error("Contract is not initialized");
        return;
      }

      try {
        const votingId = this.selectedVoting.id; 
        const optionId = index; 
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

        // Обновляем детали голосования после голосования
        await this.fetchVotingDetails(votingId);
      } catch (error) {
        console.error("Error voting:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
  },
  watch: {
    selectedVotingId(newVotingId) {
      console.log("New voting ID:", newVotingId);
      if (newVotingId !== null) {
        this.fetchVotingDetails(newVotingId);
      } else {
        this.selectedVoting = null;
      }
    },
  },
  mounted() {
    this.connectWallet();
  },
};
</script>

<style scoped>
.voting-details {
  width: 50%;
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  border-left: 1px solid #ccc;
}

.no-voting-selected {
  width: 50%;
  background-color: #f0f0f0;
  padding: 20px;
  box-sizing: border-box;
  border-left: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  padding: 5px 10px;
  cursor: pointer;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover {
  background-color: #3da87a;
}
</style>
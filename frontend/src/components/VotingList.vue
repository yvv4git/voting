<template>
  <div class="voting-list">
    <ul>
      <li v-for="voting in votings" :key="voting.id">
        <div @click="selectVoting(voting)" class="voting-item">
          {{ voting.name }} (Finish: {{ formatDate(voting.finishAt) }})
        </div>
        <button @click="deleteVoting(voting.id)" class="delete-button">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import Web3 from "web3";
import { votingListABI, contractAddress } from "./contracts/votingList";

export default {
  name: "VotingList",
  data() {
    return {
      votings: [],
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

          // Получаем все голосования
          await this.fetchAllVotings();
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.error("MetaMask is not installed");
      }
    },
    async fetchAllVotings() {
      if (!this.contract) {
        console.error("Contract is not initialized");
        return;
      }

      try {
        // Получаем список всех голосований
        const votings = await this.contract.methods.getAllVotings().call();

        // Преобразуем данные в удобный формат
        this.votings = votings.map(voting => ({
          id: voting.id,
          name: voting.name,
          finishAt: Number(voting.finishAt) * 1000, // Преобразуем BigInt в число и в миллисекунды
          isDeleted: voting.isDeleted,
        }));
      } catch (error) {
        console.error("Error fetching all votings:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
    },
    selectVoting(voting) {
      this.$emit("select-voting", voting);
    },
    deleteVoting(votingId) {
      this.$emit("delete-voting", votingId);
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
  },
  mounted() {
    this.connectWallet();
  },
};
</script>

<style scoped>
.voting-list {
  width: 50%;
  background-color: #f0f0f0;
  padding: 20px;
  box-sizing: border-box;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.voting-item {
  flex-grow: 1;
}

.delete-button {
  padding: 5px 10px;
  cursor: pointer;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  margin-left: 10px;
}

.delete-button:hover {
  background-color: #e60000;
}
</style>
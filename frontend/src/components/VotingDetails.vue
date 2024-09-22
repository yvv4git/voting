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
import { connectWallet, fetchVotingDetails, voteForOption } from "../utils/blockchainUtils";
import Web3 from "web3"; // Импортируем Web3

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
      try {
        const { web3, contract, accounts } = await connectWallet();
        this.web3 = web3;
        this.contract = contract;
        this.accounts = accounts;
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    },
    async fetchVotingDetails(votingId) {
      if (!this.contract) {
        console.error("Contract is not initialized");
        return;
      }

      try {
        // Передаем адрес кошелька в функцию fetchVotingDetails
        this.selectedVoting = await fetchVotingDetails(this.contract, votingId, this.accounts[0]);
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

        await voteForOption(this.contract, this.web3, this.accounts, votingId, optionId, value);

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
      console.log("Selected voting ID:", newVotingId);
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
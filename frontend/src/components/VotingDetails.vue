<template>
  <div class="voting-details" v-if="selectedVoting">
    <h2>{{ selectedVoting.name }}</h2>
    <p>Finish At: {{ formatDate(selectedVoting.finishAt) }}</p>
    <p>Status: {{ getStatusText(selectedVoting) }}</p>
    <p>Voted: {{ selectedVoting.voted ? 'Yes' : 'No' }}</p>
    <ul>
      <li v-for="(option, index) in selectedVoting.options" :key="index">
        {{ option.name }} - {{ option.points }} number of votes
        <button
          @click="voteForOption(index)"
          :disabled="selectedVoting.voted || selectedVoting.finishAt <= currentTimestamp"
          :title="selectedVoting.voted ? 'You have already voted' : selectedVoting.finishAt <= currentTimestamp ? 'Voting has ended' : ''"
        >
          Vote
        </button>
      </li>
    </ul>
  </div>
  <div v-else class="no-voting-selected">
    <p>Select the vote on the left to see the details.</p>
  </div>
  <PreloaderComponent v-if="loading" />
</template>

<script>
import { connectWallet, fetchVotingDetails, voteForOption } from "../utils/blockchainUtils";
import Web3 from "web3";
import PreloaderComponent from "./PreloaderComponent.vue";

export default {
  name: "VotingDetails",
  components: {
    PreloaderComponent,
  },
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
      loading: false,
    };
  },
  computed: {
    currentTimestamp() {
      return Date.now();
    },
  },
  methods: {
    async connectWallet() {
      this.loading = true;
      console.log("Connecting to MetaMask...");
      try {
        const { web3, contract, accounts } = await connectWallet();
        this.web3 = web3;
        this.contract = contract;
        this.accounts = accounts;
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchVotingDetails(votingId) {
      this.loading = true;
      if (!this.contract) {
        console.error("Contract is not initialized");
        return;
      }

      try {
        this.selectedVoting = await fetchVotingDetails(this.contract, votingId, this.accounts[0]);
      } catch (error) {
        console.error("Error fetching voting details:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      } finally {
        this.loading = false;
      }
    },
    async voteForOption(index) {
      this.loading = true;
      if (!this.contract) {
        console.error("Contract is not initialized");
        return;
      }

      try {
        const votingId = this.selectedVoting.id; 
        const optionId = index; 
        const value = Web3.utils.toWei("0.001", "ether");

        await voteForOption(this.contract, this.web3, this.accounts, votingId, optionId, value);

        // Обновляем детали голосования после голосования
        await this.fetchVotingDetails(votingId);
      } catch (error) {
        console.error("Error voting:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      } finally {
        this.loading = false;
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
    getStatusText(voting) {
      return voting.finishAt > this.currentTimestamp ? 'Active' : 'Completed';
    },
  },
  watch: {
    selectedVotingId(newVotingId) {
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

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #3da87a;
}
</style>
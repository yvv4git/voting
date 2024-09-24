<template>
  <div id="app">
    <header class="app-header">
      <div class="header-buttons">
        <button @click="openModal">Add a vote</button>
      </div>
      <div class="wallet-status">
        <span v-if="isConnected" class="connected-icon">🔵</span>
        <span v-else class="disconnected-icon">🔴</span>
        <span v-if="accounts.length > 0">
          {{ accounts[0].slice(-4) }}
        </span>
      </div>
    </header>
    <div class="voting-container">
      <VotingList
        @select-voting="onSelectVoting"
        @delete-voting="onDeleteVoting"
        :votings="votings"
        :contract="contract"
        :web3="web3"
        :accounts="accounts"
      />
      <VotingDetails
        :selectedVotingId="selectedVotingId"
        @vote-for-option="voteForOption"
      />
    </div>
    <footer class="app-footer">
      <p>&copy; 2024 Eliseev V.V. All rights reserved.</p>
    </footer>
    <AddVotingModal
      :showModal="showModal"
      @close-modal="closeModal"
      @voting-created="fetchAllVotings"
    />
  </div>
</template>

<script>
import VotingList from "./components/VotingList.vue";
import VotingDetails from "./components/VotingDetails.vue";
import AddVotingModal from "./components/AddVotingModal.vue";
import { connectWallet, fetchAllVotings, deleteVoting } from "./utils/blockchainUtils";

export default {
  name: "App",
  components: {
    VotingList,
    VotingDetails,
    AddVotingModal,
  },
  data() {
    return {
      selectedVotingId: null,
      showModal: false,
      votings: [],
      web3: null,
      contract: null,
      accounts: [],
      isConnected: false, 
    };
  },
  methods: {
    resetState() {
      this.selectedVotingId = null;
      this.showModal = false;
      this.votings = [];
      this.web3 = null;
      this.contract = null;
      this.accounts = [];
      this.isConnected = false;
    },
    async connectWallet() {
      try {
        const { web3, contract, accounts } = await connectWallet();
        this.web3 = web3;
        this.contract = contract;
        this.accounts = accounts;
        this.isConnected = true;
        await this.fetchAllVotings();
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        this.isConnected = false;
      }
    },
    async fetchAllVotings() {
      try {
        this.votings = await fetchAllVotings(this.contract);
      } catch (error) {
        console.error("Error fetching votings:", error);
      }
    },
    onSelectVoting(votingId) {
      this.selectedVotingId = Number(votingId);
    },
    async onDeleteVoting(votingId) {
      try {
        await deleteVoting(this.contract, this.web3, this.accounts, votingId);
        console.log("Voting deleted successfully");

        // Обновляем список голосований
        await this.fetchAllVotings();

        // Обновляем selectedVotingId, если удаляемое голосование было выбрано
        if (this.selectedVotingId === votingId) {
          this.selectedVotingId = null;
        }
      } catch (error) {
        console.error("Error deleting voting:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    voteForOption(votingId, optionIndex) {
      // Логика голосования за вариант
      console.log("Vote for option:", optionIndex, "in voting with ID:", votingId);
    },
  },
  created() {
    this.resetState(); // Сбрасываем состояние при создании компонента
    this.connectWallet();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #42b983;
  color: white;
  padding: 20px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-buttons {
  display: flex;
  align-items: center;
}

.wallet-status {
  display: flex;
  align-items: center;
}

.connected-icon, .disconnected-icon {
  margin-right: 5px;
}

.app-footer {
  background-color: #2c3e50;
  color: white;
  padding: 10px;
  margin-top: auto;
}

.voting-container {
  display: flex;
  flex: 1;
}

button {
  padding: 10px 20px;
  cursor: pointer;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  margin-left: 10px;
}

button:hover {
  background-color: #3a5168;
}
</style>
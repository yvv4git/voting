<template>
  <div id="app">
    <header class="app-header">
      <div class="header-buttons">
        <button @click="openModal">Add a vote</button>
        <button v-if="isOwner" @click="withdrawFunds">Withdraw</button>
      </div>
      <div class="wallet-status">
        <span v-if="isConnected" class="connected-icon">🛜</span>
        <span v-else class="disconnected-icon">🔴</span>
        <span v-if="accounts.length > 0">
          {{ accounts[0].slice(-4) }}
        </span>
      </div>
      <div class="contract-balance">
        Contract Balance: {{ contractBalance }} ETH
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
        :selectedVotingId="selectedVotingId"
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
import { connectWallet, fetchAllVotings, deleteVoting, getContractBalance, withdrawFunds } from "./utils/blockchainUtils";

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
      contractBalance: "0",
      isOwner: false,
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
      this.contractBalance = "0";
      this.isOwner = false;
    },
    async connectWallet() {
      try {
        const { web3, contract, accounts } = await connectWallet();
        this.web3 = web3;
        this.contract = contract;
        this.accounts = accounts;
        this.isConnected = true;
        await this.fetchAllVotings();
        await this.fetchContractBalance();
        await this.checkOwner(); // We check whether the current user is the owner of the contract
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
    async fetchContractBalance() {
      try {
        this.contractBalance = await getContractBalance(this.web3, this.contract.options.address);
      } catch (error) {
        console.error("Error fetching contract balance:", error);
      }
    },
    async withdrawFunds() {
      try {
        await withdrawFunds(this.contract, this.web3, this.accounts);
        await this.fetchContractBalance();
      } catch (error) {
        console.error("Error withdrawing funds:", error);
      }
    },
    onSelectVoting(votingId) {
      this.selectedVotingId = Number(votingId);
    },
    async onDeleteVoting(votingId) {
      try {
        await deleteVoting(this.contract, this.web3, this.accounts, votingId);
        console.log("Voting deleted successfully");

        await this.fetchAllVotings();

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
      console.log("Vote for option:", optionIndex, "in voting with ID:", votingId);
    },
    async checkOwner() {
      try {
        const ownerAddress = await this.contract.methods.owner().call();
        this.isOwner = this.accounts[0] === ownerAddress;
      } catch (error) {
        console.error("Error checking owner:", error);
      }
    },
  },
  created() {
    this.resetState();
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
  background-color: #3e8db7;
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

.contract-balance {
  margin-left: 20px;
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
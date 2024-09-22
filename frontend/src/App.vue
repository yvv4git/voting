<template>
  <div id="app">
    <header class="app-header">
      <div class="header-buttons">
        <WalletConnect />
        <button @click="openModal">Add a vote</button>
      </div>
    </header>
    <div class="voting-container">
      <VotingList
        @select-voting="onSelectVoting"
        @delete-voting="onDeleteVoting"
        :votings="votings"
      />
      <VotingDetails
        :selectedVotingId="selectedVotingId"
        @vote-for-option="voteForOption"
      />
    </div>
    <footer class="app-footer">
      <p>&copy; 2023 Eliseev V.V. All rights reserved.</p>
    </footer>
    <AddVotingModal
      :showModal="showModal"
      @close-modal="closeModal"
      @add-voting="addVoting"
    />
  </div>
</template>

<script>
import VotingList from "./components/VotingList.vue";
import VotingDetails from "./components/VotingDetails.vue";
import WalletConnect from "./components/WalletConnect.vue";
import AddVotingModal from "./components/AddVotingModal.vue";
import Web3 from "web3";
import { votingListABI, contractAddress } from "./components/contracts/votingList";

export default {
  name: "App",
  components: {
    VotingList,
    VotingDetails,
    WalletConnect,
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
        this.votings = votings.map((voting) => ({
          id: voting.id,
          title: voting.name,
          options: voting.options,
          votingEnd: Number(voting.finishAt) * 1000, // Преобразуем BigInt в число и в миллисекунды
          isDeleted: voting.isDeleted,
        }));
      } catch (error) {
        console.error("Error fetching all votings:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
    },
    onSelectVoting(votingId) {
      this.selectedVotingId = Number(votingId);
    },
    async onDeleteVoting(votingId) {
      if (!this.contract) {
        console.error("Contract is not initialized");
        return;
      }

      try {
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
    addVoting(newVoting) {
      const newId = Math.max(...this.votings.map((v) => v.id)) + 1;
      this.votings.push({ id: newId, ...newVoting });
    },
    voteForOption(votingId, optionIndex) {
      // Логика голосования за вариант
      console.log("Vote for option:", optionIndex, "in voting with ID:", votingId);
    },
  },
  mounted() {
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

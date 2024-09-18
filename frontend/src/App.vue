<template>
  <div id="app">
    <header class="app-header">
      <div class="header-buttons">
        <WalletConnect />
        <button @click="openModal">Добавить голосование</button>
      </div>
    </header>
    <div class="voting-container">
      <VotingList @select-voting="onSelectVoting" :votings="votings" />
      <VotingDetails :selectedVoting="selectedVoting" />
    </div>
    <footer class="app-footer">
      <p>&copy; 2023 Your Company. All rights reserved.</p>
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
      selectedVoting: null,
      showModal: false,
      votings: [
        {
          id: 1,
          title: "Голосование за еду на вечер",
          options: ["Пицца", "Пирожки", "Торт"],
        },
        {
          id: 2,
          title: "Голосование за фильм на вечер",
          options: ["Терминатор", "Титаник", "Аватар"],
        },
      ],
    };
  },
  methods: {
    onSelectVoting(voting) {
      this.selectedVoting = voting;
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

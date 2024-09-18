<template>
  <div id="app">
    <header class="app-header">
      <WalletConnect />
    </header>
    <div class="voting-container">
      <VotingList @select-voting="onSelectVoting" />
      <VotingDetails :selectedVoting="selectedVoting" />
    </div>
    <footer class="app-footer">
      <p>&copy; 2024 Eliseev V.V. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import VotingList from './components/VotingList.vue';
import VotingDetails from './components/VotingDetails.vue';
import WalletConnect from './components/WalletConnect.vue';

export default {
  name: 'App',
  components: {
    VotingList,
    VotingDetails,
    WalletConnect,
  },
  data() {
    return {
      selectedVoting: null,
    };
  },
  methods: {
    onSelectVoting(voting) {
      this.selectedVoting = voting;
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
</style>
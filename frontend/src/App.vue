<template>
  <div id="app">
    <WalletConnect />
    <div class="voting-container">
      <VotingList @select-voting="onSelectVoting" />
      <VotingDetails :selectedVoting="selectedVoting" />
    </div>
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
  margin-top: 60px;
}
.voting-container {
  display: flex;
}
</style>
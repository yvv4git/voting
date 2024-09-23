<template>
  <div class="voting-list">
    <ul>
      <li v-for="voting in activeVotings" :key="voting.id" :class="getStatusClass(voting)">
        <div @click="selectVoting(voting.id)" class="voting-item">
          <span class="status-icon" :class="getStatusIconClass(voting)"></span>
          {{ voting.name }} (Finish: {{ formatDate(voting.finishAt) }})
        </div>
        <button
          @click="deleteVoting(voting.id)"
          class="delete-button"
          :disabled="voting.finishAt > currentTimestamp"
          :title="voting.finishAt > currentTimestamp ? 'Voting has not ended yet' : ''"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "VotingList",
  props: {
    votings: {
      type: Array,
      required: true,
    },
    contract: {
      type: Object,
      required: true,
    },
    web3: {
      type: Object,
      required: true,
    },
    accounts: {
      type: Array,
      required: true,
    },
  },
  computed: {
    activeVotings() {
      return this.votings.filter(voting => !voting.isDeleted);
    },
    currentTimestamp() {
      return Date.now();
    },
  },
  methods: {
    selectVoting(votingId) {
      console.log("Selected voting with ID (before conversion):", votingId);
      console.log("Selected voting with ID (after conversion):", Number(votingId));
      this.$emit("select-voting", votingId);
    },
    async deleteVoting(votingId) {
      console.log("Deleting voting with ID:", votingId); // Выводим сообщение в консоль
      try {
        await this.$emit("delete-voting", votingId);
      } catch (error) {
        console.error("Error deleting voting:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
    getStatusClass(voting) {
      return voting.finishAt > this.currentTimestamp ? 'active' : 'inactive';
    },
    getStatusIconClass(voting) {
      return voting.finishAt > this.currentTimestamp ? 'active-icon' : 'inactive-icon';
    },
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
  display: flex;
  align-items: center;
}

.status-icon {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
}

.active-icon {
  background-color: green;
}

.inactive-icon {
  background-color: red;
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

.delete-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.delete-button:hover:not(:disabled) {
  background-color: #e60000;
}

.active {
  background-color: #e0ffe0; /* Светло-зеленый фон для активных голосований */
}

.inactive {
  background-color: #f0f0f0; /* Светло-серый фон для неактивных голосований */
}
</style>
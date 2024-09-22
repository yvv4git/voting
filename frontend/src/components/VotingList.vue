<template>
  <div class="voting-list">
    <ul>
      <li v-for="voting in activeVotings" :key="voting.id">
        <div @click="selectVoting(voting.id)" class="voting-item">
          {{ voting.name }} (Finish: {{ formatDate(voting.finishAt) }})
        </div>
        <button @click="deleteVoting(voting.id)" class="delete-button">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { deleteVoting } from "../utils/blockchainUtils";

export default {
  name: "VotingList",
  props: {
    votings: {
      type: Array,
      required: true,
    },
  },
  computed: {
    activeVotings() {
      return this.votings.filter(voting => !voting.isDeleted);
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
        await deleteVoting(this.contract, this.web3, this.accounts, votingId);
        // Обновляем список голосований после удаления
        await this.fetchAllVotings();
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
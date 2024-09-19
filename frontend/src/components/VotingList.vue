<template>
  <div class="voting-list">
    <ul>
      <li v-for="voting in votings" :key="voting.id">
        <div @click="selectVoting(voting)" class="voting-item">
          {{ voting.title }} (Finish: {{ formatDate(voting.votingEnd) }})
        </div>
        <button @click="deleteVoting(voting.id)" class="delete-button">Delete</button>
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
  },
  methods: {
    selectVoting(voting) {
      this.$emit("select-voting", voting);
    },
    deleteVoting(votingId) {
      this.$emit("delete-voting", votingId);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
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

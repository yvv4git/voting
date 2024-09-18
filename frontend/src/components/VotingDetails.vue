<template>
  <div class="voting-details" v-if="selectedVoting">
    <h2>{{ selectedVoting.title }}</h2>
    <ul>
      <li v-for="(option, index) in selectedVoting.options" :key="index">
        {{ option }} - {{ votes[index] }} голосов
        <button @click="voteForOption(index)">Vote</button>
      </li>
    </ul>
  </div>
  <div v-else class="no-voting-selected">
    <p>Select the vote on the left to see the details.</p>
  </div>
</template>

<script>
export default {
  name: "VotingDetails",
  props: {
    selectedVoting: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      votes: this.selectedVoting ? this.selectedVoting.options.map(() => 0) : [], // Инициализация голосов для каждого варианта
    };
  },
  methods: {
    voteForOption(index) {
      this.$data.votes[index] += 1;
    },
  },
  watch: {
    selectedVoting(newVoting) {
      if (newVoting) {
        this.votes = newVoting.options.map(() => 0);
      }
    },
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

button:hover {
  background-color: #3da87a;
}
</style>

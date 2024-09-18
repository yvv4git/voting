<template>
  <div class="voting-details" v-if="selectedVoting">
    <h2>{{ selectedVoting.title }}</h2>
    <ul>
      <li v-for="(option, index) in selectedVoting.options" :key="index">
        {{ option }} - {{ votes[index] }} голосов
      </li>
    </ul>
  </div>
  <div v-else class="no-voting-selected">
    <p>Выберите голосование слева, чтобы увидеть детали.</p>
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
      votes: [0, 0, 0], // Пример голосов для каждого варианта
    };
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
}
</style>

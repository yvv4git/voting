<template>
  <div class="voting-details" v-if="selectedVoting">
    <h2>{{ selectedVoting.title }}</h2>
    <ul>
      <li v-for="(option, index) in selectedVoting.options" :key="index">
        {{ option }} - {{ votes[index] }} голосов
      </li>
    </ul>
  </div>
  <div v-else>
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
  float: right;
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

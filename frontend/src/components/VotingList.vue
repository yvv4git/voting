<template>
  <div class="voting-list">
    <ul>
      <li v-for="voting in votings" :key="voting.id" @click="selectVoting(voting)">
        {{ voting.title }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "VotingList",
  data() {
    return {
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
    selectVoting(voting) {
      this.$emit("select-voting", voting);
    },
  },
};
</script>

<style scoped>
.voting-list {
  width: 50%;
  float: left;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
li:hover {
  background-color: #f0f0f0;
}
</style>

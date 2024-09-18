<template>
  <div class="modal-overlay" v-if="showModal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Add a new voteе</h2>
      <form @submit.prevent="addVoting">
        <div class="form-group">
          <label for="title">The name of the vote:</label>
          <input type="text" id="title" v-model="newVoting.title" required />
        </div>
        <div class="form-group" v-for="(option, index) in newVoting.options" :key="index">
          <label :for="'option' + index"> {{ index + 1 }}:</label>
          <input
            type="text"
            :id="'option' + index"
            v-model="newVoting.options[index]"
            required
          />
        </div>
        <div class="form-group">
          <label for="votingEnd">When does the voting end:</label>
          <input
            type="datetime-local"
            id="votingEnd"
            v-model="newVoting.votingEnd"
            required
          />
        </div>
        <button type="button" @click="addOption">Add an option</button>
        <button type="submit">Create a vote</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddVotingModal",
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      newVoting: {
        title: "",
        options: ["", ""], // Начальные два варианта
        votingEnd: "", // Поле для даты и времени окончания голосования
      },
    };
  },
  methods: {
    addOption() {
      this.newVoting.options.push("");
    },
    addVoting() {
      this.$emit("add-voting", { ...this.newVoting });
      this.closeModal();
    },
    closeModal() {
      this.$emit("close-modal");
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
}
</style>

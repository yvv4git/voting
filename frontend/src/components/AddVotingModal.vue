<template>
  <div class="modal-overlay" v-if="showModal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Add a new vote</h2>
      <form @submit.prevent="addVoting">
        <div class="form-group">
          <label for="title">The name of the vote:</label>
          <input type="text" id="title" v-model="newVoting.title" required />
        </div>
        <div class="form-group" v-for="(option, index) in newVoting.options" :key="index">
          <label :for="'option' + index"> {{ index + 1 }}:</label>
          <div class="option-input-group">
            <input
              type="text"
              :id="'option' + index"
              v-model="newVoting.options[index]"
              required
            />
            <button type="button" @click="removeOption(index)" class="remove-option-button">Remove</button>
          </div>
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
import { connectWallet, createVoting } from "../utils/blockchainUtils";

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
      web3: null,
      contract: null,
      accounts: [],
    };
  },
  methods: {
    async connectWallet() {
      try {
        const { web3, contract, accounts } = await connectWallet();
        this.web3 = web3;
        this.contract = contract;
        this.accounts = accounts;
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    },
    addOption() {
      this.newVoting.options.push("");
    },
    removeOption(index) {
      this.newVoting.options.splice(index, 1);
    },
    async addVoting() {
      if (!this.contract) {
        console.error("Contract is not initialized");
        return;
      }

      try {
        const votingData = {
          title: this.newVoting.title,
          options: this.newVoting.options,
          votingEnd: this.newVoting.votingEnd,
          commission: 1000000000000000, // 0.001 ETH
        };

        await createVoting(this.contract, this.web3, this.accounts, votingData);

        this.closeModal();
        this.$emit("voting-created"); // Уведомляем родительский компонент о создании голосования
      } catch (error) {
        console.error("Error creating voting:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
    },
    closeModal() {
      this.$emit("close-modal");
    },
  },
  mounted() {
    this.connectWallet();
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

.option-input-group {
  display: flex;
  align-items: center;
}

.remove-option-button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-option-button:hover {
  background-color: #e60000;
}
</style>
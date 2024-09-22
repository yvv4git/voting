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
import Web3 from "web3";
import { votingListABI, contractAddress } from "./contracts/votingList";

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
        options: ["", "", ""], // Начальные три варианта
        votingEnd: "", // Поле для даты и времени окончания голосования
      },
      web3: null,
      contract: null,
      accounts: [],
    };
  },
  methods: {
    async connectWallet() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          this.web3 = new Web3(window.ethereum);
          this.accounts = await this.web3.eth.getAccounts();
          console.log("Connected accounts:", this.accounts);

          // Подключаемся к контракту
          this.contract = new this.web3.eth.Contract(votingListABI, contractAddress);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.error("MetaMask is not installed");
      }
    },
    addOption() {
      this.newVoting.options.push("");
    },
    async addVoting() {
      if (!this.contract) {
        console.error("Contract is not initialized");
        return;
      }

      try {
        const name = this.newVoting.title;
        const finishAt = Math.floor(new Date(this.newVoting.votingEnd).getTime() / 1000); // Преобразуем в timestamp
        const options = this.newVoting.options.filter(option => option.trim() !== ""); // Убираем пустые опции
        const commission = 1000000000000000; // 0.001 ETH - сколко требовать денег за создание голосования

        // Получаем текущий nonce для аккаунта
        const nonce = await this.web3.eth.getTransactionCount(this.accounts[0]);
        console.log("Nonce:", nonce);

        // Определяем gasLimit автоматически
        const gasLimitBigInt = await this.contract.methods
          .createVoting(name, finishAt, options, commission)
          .estimateGas({
            from: this.accounts[0],
            value: commission,
          });

        // Преобразуем BigInt в обычное число
        const gasLimit = Number(gasLimitBigInt);
        console.log("Gas limit:", gasLimit);

        // Вызываем функцию контракта
        await this.contract.methods
          .createVoting(name, finishAt, options, commission)
          .send({
            from: this.accounts[0],
            value: commission, // Если функция payable, передаем значение
            gasPrice: Web3.utils.toWei("1", "gwei"), // Укажите цену газа
            gasLimit: gasLimit, // Укажите лимит газа
            nonce: nonce, // Укажите nonce
          });

        console.log("Voting created successfully");
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
</style>
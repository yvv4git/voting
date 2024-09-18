<template>
  <div class="wallet-connect">
    <button @click="connectWallet">Подключить кошелек</button>
  </div>
</template>

<script>
import Web3 from "web3";

export default {
  name: "WalletConnect",
  methods: {
    async connectWallet() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();
          console.log("Connected accounts:", accounts);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.error("MetaMask is not installed");
      }
    },
  },
};
</script>

<style scoped>
.wallet-connect {
  margin-bottom: 0px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
}
button:hover {
  background-color: #3a5168;
}
</style>

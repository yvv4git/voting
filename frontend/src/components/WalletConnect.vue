<template>
  <div class="wallet-connect">
    <button @click="connectWallet">Подключить MetaMask</button>
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
  margin-bottom: 20px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>

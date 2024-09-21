require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    localGanache: {
      url: "http://127.0.0.1:8545", // URL вашей локальной сети Ethereum
      accounts: ["0x09eab3706800a28aa5d090efb50e221273a31aefa7b3d9048ff28581f5963708"], // Замените на ваш приватный ключ
    },
    localHardhat: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
};

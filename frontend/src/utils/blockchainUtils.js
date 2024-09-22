// src/utils/blockchainUtils.js

import Web3 from "web3";
import { votingListABI, contractAddress } from "../components/contracts/votingList";

export async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      console.log("Connected accounts:", accounts);

      // Подключаемся к контракту
      const contract = new web3.eth.Contract(votingListABI, contractAddress);

      return { web3, contract, accounts };
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      throw error;
    }
  } else {
    console.error("MetaMask is not installed");
    throw new Error("MetaMask is not installed");
  }
}

export async function createVoting(contract, web3, accounts, votingData) {
  if (!contract) {
    console.error("Contract is not initialized");
    return;
  }

  try {
    const { title, options, votingEnd, commission } = votingData;
    const finishAt = Math.floor(new Date(votingEnd).getTime() / 1000); // Преобразуем в timestamp
    const filteredOptions = options.filter(option => option.trim() !== ""); // Убираем пустые опции

    // Получаем текущий nonce для аккаунта
    const nonce = await web3.eth.getTransactionCount(accounts[0]);
    console.log("Nonce:", nonce);

    // Определяем gasLimit автоматически
    const gasLimitBigInt = await contract.methods
      .createVoting(title, finishAt, filteredOptions, commission)
      .estimateGas({
        from: accounts[0],
        value: commission,
      });

    // Преобразуем BigInt в обычное число
    const gasLimit = Number(gasLimitBigInt);
    console.log("Gas limit:", gasLimit);

    // Вызываем функцию контракта
    await contract.methods
      .createVoting(title, finishAt, filteredOptions, commission)
      .send({
        from: accounts[0],
        value: commission, // Если функция payable, передаем значение
        gasPrice: Web3.utils.toWei("1", "gwei"), // Укажите цену газа
        gasLimit: gasLimit, // Укажите лимит газа
        nonce: nonce, // Укажите nonce
      });

    console.log("Voting created successfully");
  } catch (error) {
    console.error("Error creating voting:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
}

export async function fetchAllVotings(contract) {
  if (!contract) {
    console.error("Contract is not initialized");
    return [];
  }

  try {
    // Получаем список всех голосований
    const votings = await contract.methods.getAllVotings().call();
    console.log("Votings from contract:", votings);

    // Преобразуем данные в удобный формат
    return votings.map(voting => ({
      id: voting.id,
      name: voting.name,
      finishAt: Number(voting.finishAt) * 1000, // Преобразуем BigInt в число и в миллисекунды
      isDeleted: voting.isDeleted,
    }));
  } catch (error) {
    console.error("Error fetching all votings:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
}

export async function deleteVoting(contract, web3, accounts, votingId) {
  if (!contract) {
    console.error("Contract is not initialized");
    return;
  }

  try {
    // Получаем текущий nonce для аккаунта
    const nonce = await web3.eth.getTransactionCount(accounts[0]);

    // Определяем gasLimit автоматически
    const gasLimitBigInt = await contract.methods
      .deleteVoting(votingId)
      .estimateGas({
        from: accounts[0],
      });

    // Преобразуем BigInt в обычное число
    const gasLimit = Number(gasLimitBigInt);
    console.log("Gas limit:", gasLimit);

    // Вызываем функцию контракта
    await contract.methods.deleteVoting(votingId).send({
      from: accounts[0],
      gasPrice: Web3.utils.toWei("1", "gwei"), // Укажите цену газа
      gasLimit: gasLimit, // Укажите лимит газа
      nonce: nonce, // Укажите nonce
    });

    console.log("Voting deleted successfully");
  } catch (error) {
    console.error("Error deleting voting:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
}

export async function fetchVotingDetails(contract, votingId, fromAddress) {
  if (!contract) {
    console.error("Contract is not initialized");
    return null;
  }

  try {
    // Получаем детальную информацию о голосовании с указанием адреса кошелька
    const votingDetails = await contract.methods.getVotingDetails(votingId).call({ from: fromAddress });
    console.log("Raw Voting Details:", votingDetails); // Добавьте это для отладки

    // Преобразуем данные в удобный формат
    return {
      id: votingDetails.id,
      name: votingDetails.name,
      finishAt: Number(votingDetails.finishAt) * 1000, // Преобразуем BigInt в число и в миллисекунды
      isDeleted: votingDetails.isDeleted,
      options: votingDetails.options.map(option => ({
        name: option.name,
        points: option.points,
      })),
      voted: votingDetails.voted, // Добавляем флаг voted
    };
  } catch (error) {
    console.error("Error fetching voting details:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
}

export async function voteForOption(contract, web3, accounts, votingId, optionId, value) {
  if (!contract) {
    console.error("Contract is not initialized");
    return;
  }

  try {
    // Получаем текущий nonce для аккаунта
    const nonce = await web3.eth.getTransactionCount(accounts[0]);

    // Определяем gasLimit автоматически
    const gasLimitBigInt = await contract.methods
      .vote(votingId, optionId)
      .estimateGas({
        from: accounts[0],
        value: value,
      });

    // Преобразуем BigInt в обычное число
    const gasLimit = Number(gasLimitBigInt);
    console.log("Gas limit:", gasLimit);

    // Вызываем функцию контракта
    await contract.methods.vote(votingId, optionId).send({
      from: accounts[0],
      value: value, // Если функция payable, передаем значение
      gasPrice: Web3.utils.toWei("1", "gwei"), // Укажите цену газа
      gasLimit: gasLimit, // Укажите лимит газа
      nonce: nonce, // Укажите nonce
    });

    console.log("Voted successfully");
  } catch (error) {
    console.error("Error voting:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
}
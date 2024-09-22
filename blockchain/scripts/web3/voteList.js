// votingList.js

import { ethers } from "ethers";

// ABI контракта
const votingListABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "votingId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "optionId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      }
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "votingId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "finishAt",
        "type": "uint256"
      }
    ],
    "name": "VotingCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "votingId",
        "type": "uint256"
      }
    ],
    "name": "VotingDeleted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_finishAt",
        "type": "uint256"
      },
      {
        "internalType": "string[]",
        "name": "_options",
        "type": "string[]"
      },
      {
        "internalType": "uint256",
        "name": "_commission",
        "type": "uint256"
      }
    ],
    "name": "createVoting",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_votingId",
        "type": "uint256"
      }
    ],
    "name": "deleteVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_votingId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_optionId",
        "type": "uint256"
      }
    ],
    "name": "getOption",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "points",
            "type": "uint256"
          }
        ],
        "internalType": "struct VotingList.Option",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_votingId",
        "type": "uint256"
      }
    ],
    "name": "getVotes",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_votingId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_optionId",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "votings",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "finishAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "commission",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deleted_at",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "optionsCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingsCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Адрес развернутого контракта (замените на реальный адрес)
const contractAddress = "0x8464135c8F25Da09e49BC8782676a84730C318bC";

// Подключение к уже развернутому контракту
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, votingListABI, signer);

// Функция для получения списка голосований
async function getVotings() {
    const votingsCount = await contract.votingsCount();
    const votings = [];

    for (let i = 0; i < votingsCount; i++) {
        const voting = await contract.votings(i);
        const votes = await contract.getVotes(i);

        const options = [];
        for (let j = 0; j < voting.optionsCount; j++) {
            const option = await contract.getOption(i, j);
            options.push({
                name: option.name,
                points: votes[j]
            });
        }

        votings.push({
            id: i,
            name: voting.name,
            finishAt: new Date(Number(voting.finishAt) * 1000).toLocaleString(),
            commission: ethers.utils.formatEther(voting.commission),
            deletedAt: voting.deleted_at > 0 ? new Date(Number(voting.deleted_at) * 1000).toLocaleString() : 'Not deleted',
            options: options
        });
    }

    return votings;
}

// Пример использования
getVotings().then(votings => {
    console.log(votings);
});
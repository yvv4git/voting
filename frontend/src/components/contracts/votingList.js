// contract.js
export const votingListABI = [
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
    "inputs": [],
    "name": "getAllVotings",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
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
            "internalType": "bool",
            "name": "isDeleted",
            "type": "bool"
          }
        ],
        "internalType": "struct VotingList.VotingData[]",
        "name": "",
        "type": "tuple[]"
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
      }
    ],
    "name": "getVotingDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
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
            "internalType": "bool",
            "name": "isDeleted",
            "type": "bool"
          },
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
            "internalType": "struct VotingList.Option[]",
            "name": "options",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct VotingList.DetailedVoting",
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
  }
];

export const contractAddress = "0x8464135c8F25Da09e49BC8782676a84730C318bC";
up_blockchain:
	docker compose up ganache

down_blockchain:
	docker compose down


install_hardhat:
	npm install --save-dev hardhat
	npm install @openzeppelin/contracts
	npm install web3@latest

init_hardhat_project:
	npx hardhat

hardhat_compile:
	npx hardhat compile

hardhat_node:
	npx hardhat node

run_contract:
	npx hardhat run --network localhost scripts/voting_list.js
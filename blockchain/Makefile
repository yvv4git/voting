up_blockchain:
	docker compose up -d ganache

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

hardhat_scripts_deploy:
	npx hardhat run --network localHardhat scripts/deploy.js

hardhat_scripts_deploy_ganache:
	npx hardhat run --network localGanache scripts/deploy.js

hardhat_scripts_create_voting:
	npx hardhat run --network localHardhat scripts/createVoting.js

hardhat_scripts_vote:
	npx hardhat run --network localHardhat scripts/vote.js

hardhat_scripts_delete_voting:
	npx hardhat run --network localHardhat scripts/deleteVoting.js

hardhat_scripts_list:
	npx hardhat run --network localHardhat scripts/voteList.js

hardhat_test:
	npx hardhat test
const { expect } = require("chai");
const { ethers } = require("hardhat");

// npx hardhat test --network localHardhat --grep VotingListVote
describe("VotingListVote", function () {
    let VotingList;
    let votingList;
    let owner;
    let addr1;
    let addr2;
  
    beforeEach(async function () {
      VotingList = await ethers.getContractFactory("VotingList");
      [owner, addr1, addr2] = await ethers.getSigners();
      console.log("owner: " + owner.address);
      console.log("addr1: " + addr1.address);
      console.log("addr2: " + addr2.address);

      votingList = await VotingList.deploy();
      await votingList.waitForDeployment();
    });

    describe("Vote", function () {
        it("Checking that the user has voted", async function () {
          const votingName = "Voting-1";
          const finishAt = Math.floor(Date.now() / 1000) + 3600; // Completion in 1 hour
          const options = ["Option 1", "Option 2", "Option 3"];
          const commission = ethers.parseEther("0.1"); // 0.1 ETH
  
          await votingList.createVoting(votingName, finishAt, options, commission, { value: commission });
  
          const votingId = 0;
          const optionId = 0;
          const voteAmount = ethers.parseEther("0.01"); // 0.01 ETH
  
          await votingList.connect(addr1).vote(votingId, optionId, { value: voteAmount });
  
          const votes = await votingList.connect(addr1).getVotes(votingId);
          expect(votes[optionId]).to.equal(1);

          const details = await votingList.connect(addr1).getVotingDetails(votingId);
          expect(details.voted).to.equal(true);
        });
    });
    
});
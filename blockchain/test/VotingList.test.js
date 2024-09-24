const { expect } = require("chai");
const { ethers } = require("hardhat");

// npx hardhat test --network localHardhat --grep VotingList
describe("VotingList", function () {
  let VotingList;
  let votingList;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    VotingList = await ethers.getContractFactory("VotingList");
    [owner, addr1, addr2] = await ethers.getSigners();
    votingList = await VotingList.deploy();
    await votingList.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should initialize votings array", async function () {
      const votings = await votingList.getAllVotings();
      expect(votings.length).to.equal(0);
    });
  });

  describe("Create Voting", function () {
    it("Should create a voting", async function () {
      const votingName = "Test Voting";
      const finishAt = Math.floor(Date.now() / 1000) + 3600; // Completion in 1 hour
      const options = ["Option 1", "Option 2", "Option 3"];
      const commission = ethers.parseEther("0.1"); // 0.1 ETH

      await votingList.createVoting(votingName, finishAt, options, commission, { value: commission });

      const votings = await votingList.getAllVotings();
      const voting = votings[0];
      expect(voting.name).to.equal(votingName);
      expect(voting.finishAt).to.equal(finishAt);
      expect(voting.isDeleted).to.be.false;
    });
  });

  describe("Vote", function () {
    it("Should allow voting", async function () {
      const votingName = "Test Voting";
      const finishAt = Math.floor(Date.now() / 1000) + 3600; // Completion in 1 hour
      const options = ["Option 1", "Option 2", "Option 3"];
      const commission = ethers.parseEther("0.1"); // 0.1 ETH

      await votingList.createVoting(votingName, finishAt, options, commission, { value: commission });

      const votingId = 0;
      const optionId = 0;
      const voteAmount = ethers.parseEther("0.01"); // 0.01 ETH

      await votingList.connect(addr1).vote(votingId, optionId, { value: voteAmount });

      const votingDetails = await votingList.connect(addr1).getVotingDetails(votingId);
      expect(votingDetails.voted).to.be.true;
      expect(votingDetails.options[optionId].points).to.equal(1);
    });
  });

  describe("Delete Voting", function () {
    it("Should delete a voting", async function () {
      const votingName = "Test Voting";
      const finishAt = Math.floor(Date.now() / 1000) + 3; // Completion in 3 seconds
      const options = ["Option 1", "Option 2", "Option 3"];
      const commission = ethers.parseEther("0.1"); // 0.1 ETH

      await votingList.createVoting(votingName, finishAt, options, commission, { value: commission });

      // Adding a delay of 4 seconds before deleting the vote
      await new Promise(resolve => setTimeout(resolve, 4000));

      const votingId = 0;
      await votingList.deleteVoting(votingId);

      const votings = await votingList.getAllVotings();
      const voting = votings[0];
      expect(voting.isDeleted).to.be.true;
    });
  });
});
const { expect } = require("chai");
const { ethers } = require("hardhat");

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
    it("Should initialize votingsCount to 0", async function () {
      expect(await votingList.votingsCount()).to.equal(0);
    });
  });

  describe("Create Voting", function () {
    it("Should create a voting", async function () {
      const votingName = "Test Voting";
      const finishAt = Math.floor(Date.now() / 1000) + 3600; // Завершение через 1 час
      const options = ["Option 1", "Option 2", "Option 3"];
      const commission = ethers.parseEther("0.1"); // 0.1 ETH

      await votingList.createVoting(votingName, finishAt, options, commission, { value: commission });

      const voting = await votingList.votings(0);
      expect(voting.name).to.equal(votingName);
      expect(voting.finishAt).to.equal(finishAt);
      expect(voting.optionsCount).to.equal(options.length);
    });
  });

  describe("Vote", function () {
    it("Should allow voting", async function () {
      const votingName = "Test Voting";
      const finishAt = Math.floor(Date.now() / 1000) + 3600; // Завершение через 1 час
      const options = ["Option 1", "Option 2", "Option 3"];
      const commission = ethers.parseEther("0.1"); // 0.1 ETH

      await votingList.createVoting(votingName, finishAt, options, commission, { value: commission });

      const votingId = 0;
      const optionId = 1;
      const voteAmount = ethers.parseEther("0.01"); // 0.01 ETH

      await votingList.connect(addr1).vote(votingId, optionId, { value: voteAmount });

      const votes = await votingList.getVotes(votingId);
      expect(votes[optionId]).to.equal(1);
    });
  });

  describe("Delete Voting", function () {
    it("Should delete a voting", async function () {
      const votingName = "Test Voting";
      const finishAt = Math.floor(Date.now() / 1000) + 3; // Завершение через 3 секунды
      const options = ["Option 1", "Option 2", "Option 3"];
      const commission = ethers.parseEther("0.1"); // 0.1 ETH

      await votingList.createVoting(votingName, finishAt, options, commission, { value: commission });

      // Добавляем задержку в 4 секунды перед удалением голосования
      await new Promise(resolve => setTimeout(resolve, 4000));

      const votingId = 0;
      await votingList.deleteVoting(votingId);

      const voting = await votingList.votings(votingId);
      expect(voting.deleted_at).to.not.equal(0);
    });
  });
});
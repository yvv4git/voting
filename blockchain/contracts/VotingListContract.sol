// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract VotingList {
    // Voting structure
    struct Voting {
        string name; // Voting name
        uint256 finishAt; // Timestamp of voting end
        mapping(uint256 => Option) options; // List of options
        mapping(address => Vote) votes; // Map of votes
        uint256 commission; // Commission for creating voting
        uint256 deleted_at; // Timestamp of deletion (0 if not deleted)
        uint256 optionsCount; // Number of options
    }

    // Option structure
    struct Option {
        string name; // Option name
        uint256 points; // Number of points
    }

    // Vote structure
    struct Vote {
        uint256 optionId; // Option ID
        bool exists; // Indicates if the vote exists
    }

    // Structure for returning voting data
    struct VotingData {
        uint256 id; // Voting ID
        string name; // Voting name
        uint256 finishAt; // Timestamp of voting end
        bool isDeleted; // Status (deleted or not)
    }

    // Structure for returning detailed voting information
    struct DetailedVoting {
        uint256 id; // Voting ID
        string name; // Voting name
        uint256 finishAt; // Timestamp of voting end
        bool isDeleted; // Status (deleted or not)
        Option[] options; // List of options with their details
        bool voted; // Indicates if the current wallet has voted
    }

    // List of votings
    Voting[] public votings;

    // Owner of the contract
    address public owner;

    // Events
    event VotingCreated(
        uint256 indexed votingId,
        string name,
        uint256 finishAt
    );
    event Voted(uint256 indexed votingId, uint256 optionId, address voter);
    event VotingDeleted(uint256 indexed votingId);
    event Withdrawal(address indexed to, uint256 amount);

    // Constructor to set the owner of the contract
    constructor() {
        owner = msg.sender;
    }

    // Method for creating voting
    function createVoting(
        string memory _name,
        uint256 _finishAt,
        string[] memory _options,
        uint256 _commission
    ) public payable {
        require(
            msg.value >= _commission,
            "Insufficient funds to pay the commission"
        );

        Voting storage voting = votings.push();
        voting.name = _name;
        voting.finishAt = _finishAt;
        voting.commission = _commission;
        voting.deleted_at = 0; // Initialize as not deleted
        voting.optionsCount = _options.length; // Set the number of options

        for (uint256 i = 0; i < _options.length; i++) {
            Option memory option;
            option.name = _options[i];
            option.points = 0;
            voting.options[i] = option;
        }

        emit VotingCreated(votings.length - 1, _name, _finishAt);
    }

    // Method for voting
    function vote(uint256 _votingId, uint256 _optionId) public payable {
        require(
            votings[_votingId].finishAt > block.timestamp,
            "Voting has already ended"
        );
        require(msg.value > 0, "Insufficient funds for voting");
        require(
            votings[_votingId].deleted_at == 0,
            "Voting has been deleted"
        );

        Voting storage voting = votings[_votingId];
        require(
            !voting.votes[msg.sender].exists,
            "You have already voted"
        );

        require(
            _optionId < voting.optionsCount,
            "Option index out of bounds"
        );

        voting.votes[msg.sender] = Vote(_optionId, true);
        voting.options[_optionId].points++;

        emit Voted(_votingId, _optionId, msg.sender);
    }

    // Method for deleting voting
    function deleteVoting(uint256 _votingId) public {
        require(
            votings[_votingId].finishAt <= block.timestamp,
            "Voting has not yet ended"
        );
        require(
            votings[_votingId].deleted_at == 0,
            "Voting has already been deleted"
        );

        votings[_votingId].deleted_at = block.timestamp;

        emit VotingDeleted(_votingId);
    }

    // Method for getting list of votes for each option
    function getVotes(
        uint256 _votingId
    ) public view returns (uint256[] memory) {
        Voting storage voting = votings[_votingId];
        require(
            voting.deleted_at == 0,
            "Voting has been deleted"
        );

        uint256[] memory votes = new uint256[](voting.optionsCount);

        for (uint256 i = 0; i < voting.optionsCount; i++) {
            votes[i] = voting.options[i].points;
        }
        return votes;
    }

    // Method for getting detailed information about a voting
    function getVotingDetails(uint256 _votingId) public view returns (DetailedVoting memory) {
        Voting storage voting = votings[_votingId];
        require(
            voting.deleted_at == 0,
            "Voting has been deleted"
        );

        DetailedVoting memory detailedVoting;
        detailedVoting.id = _votingId;
        detailedVoting.name = voting.name;
        detailedVoting.finishAt = voting.finishAt;
        detailedVoting.isDeleted = voting.deleted_at != 0;
        detailedVoting.voted = voting.votes[msg.sender].exists; // Check if the current wallet has voted

        detailedVoting.options = new Option[](voting.optionsCount);
        for (uint256 i = 0; i < voting.optionsCount; i++) {
            detailedVoting.options[i] = voting.options[i];
        }

        return detailedVoting;
    }

    // Method for getting all votings
    function getAllVotings() public view returns (VotingData[] memory) {
        VotingData[] memory votingDataList = new VotingData[](votings.length);

        for (uint256 i = 0; i < votings.length; i++) {
            votingDataList[i] = VotingData({
                id: i,
                name: votings[i].name,
                finishAt: votings[i].finishAt,
                isDeleted: votings[i].deleted_at != 0
            });
        }

        return votingDataList;
    }

    // Method for withdrawing funds from the contract
    function withdraw(uint256 _amount) public {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        require(_amount <= address(this).balance, "Insufficient contract balance");

        payable(msg.sender).transfer(_amount);
        emit Withdrawal(msg.sender, _amount);
    }

    // Method for checking the contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract VotingList {
    // List of votings
    mapping(uint256 => Voting) public votings;

    // Number of votings
    uint256 public votingsCount;

    // Voting structure
    struct Voting {
        string name; // Voting name
        uint256 finishAt; // Timestamp of voting end
        mapping(uint256 => Option) options; // List of options
        mapping(address => uint256) votes; // Map of votes
        uint256 commission; // Commission for creating voting
        uint256 deleted_at; // Timestamp of deletion (0 if not deleted)
        uint256 optionsCount; // Number of options
    }

    // Option structure
    struct Option {
        string name; // Option name
        uint256 points; // Number of points
    }

    // Events
    event VotingCreated(
        uint256 indexed votingId,
        string name,
        uint256 finishAt
    );
    event Voted(uint256 indexed votingId, uint256 optionId, address voter);
    event VotingDeleted(uint256 indexed votingId);

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

        Voting storage voting = votings[votingsCount];
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

        votingsCount++;

        emit VotingCreated(votingsCount - 1, _name, _finishAt);
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
            voting.votes[msg.sender] == 0,
            "You have already voted"
        );

        voting.votes[msg.sender] = _optionId;
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
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DAppStorage {

    address public owner;

    // Stores one string per wallet address
    mapping(address => string) public userData;

    event DataStored(address indexed user, string data);

    // ---------- Voting + Reward State ----------

    struct Proposal {
        uint256 id;
        string description;
        uint256 voteCount;
        bool active;
    }

    struct VoteRecord {
        bool hasVoted;
        bool claimed;
    }

    uint256 public proposalCount;
    uint256 public rewardPerVote;       // in wei

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => VoteRecord)) public voterRecords; // user => proposalId => record

    // Only owner-approved wallets can vote (stops reward farming with many wallets)
    mapping(address => bool) public isRegisteredVoter;

    event VoterRegistered(address indexed voter);
    event VoterRemoved(address indexed voter);
    event ProposalCreated(uint256 indexed id, string description);
    event Voted(uint256 indexed proposalId, address indexed voter);
    event RewardClaimed(uint256 indexed proposalId, address indexed voter, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        rewardPerVote = 0.0001 ether;   // default reward per vote (adjustable by owner)
    }

    // ---------- Storage Functions ----------

    function storeData(string memory _data) public {
        userData[msg.sender] = _data;
        emit DataStored(msg.sender, _data);
    }

    function getData(address _user) public view returns (string memory) {
        return userData[_user];
    }

    // ---------- Voter Registration ----------

    /// @notice Owner approves one wallet to vote
    function registerVoter(address _voter) public onlyOwner {
        require(_voter != address(0), "Invalid address");
        require(!isRegisteredVoter[_voter], "Already registered");
        isRegisteredVoter[_voter] = true;
        emit VoterRegistered(_voter);
    }

    /// @notice Owner approves several wallets in one transaction
    function registerVoters(address[] memory _voters) public onlyOwner {
        for (uint256 i = 0; i < _voters.length; i++) {
            address v = _voters[i];
            if (v != address(0) && !isRegisteredVoter[v]) {
                isRegisteredVoter[v] = true;
                emit VoterRegistered(v);
            }
        }
    }

    /// @notice Owner removes a wallet's voting rights
    function removeVoter(address _voter) public onlyOwner {
        require(isRegisteredVoter[_voter], "Not registered");
        isRegisteredVoter[_voter] = false;
        emit VoterRemoved(_voter);
    }

    // ---------- Voting Functions ----------

    /// @notice Owner creates a new proposal
    function createProposal(string memory _description) public onlyOwner {
        proposalCount++;
        proposals[proposalCount] = Proposal(proposalCount, _description, 0, true);
        emit ProposalCreated(proposalCount, _description);
    }

    /// @notice Registered voters can vote once per proposal
    function vote(uint256 _proposalId) public {
        require(isRegisteredVoter[msg.sender], "Not a registered voter");
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.active, "Proposal does not exist or is closed");
        require(!voterRecords[msg.sender][_proposalId].hasVoted, "Already voted");

        voterRecords[msg.sender][_proposalId].hasVoted = true;
        proposal.voteCount++;

        emit Voted(_proposalId, msg.sender);
    }

    /// @notice Voter claims their ETH reward after voting
    function claimReward(uint256 _proposalId) public {
        VoteRecord storage record = voterRecords[msg.sender][_proposalId];
        require(record.hasVoted, "You have not voted on this proposal");
        require(!record.claimed, "Reward already claimed");

        uint256 reward = rewardPerVote;
        require(address(this).balance >= reward, "Insufficient contract balance for reward");

        record.claimed = true; // effect before interaction (prevents reentrancy)

        (bool ok, ) = payable(msg.sender).call{value: reward}("");
        require(ok, "Transfer failed");

        emit RewardClaimed(_proposalId, msg.sender, reward);
    }

    /// @notice Owner closes a proposal (no more votes allowed)
    function closeProposal(uint256 _proposalId) public onlyOwner {
        require(proposals[_proposalId].active, "Proposal not active");
        proposals[_proposalId].active = false;
    }

    /// @notice Owner adjusts the reward amount (in wei)
    function setRewardPerVote(uint256 _amount) public onlyOwner {
        rewardPerVote = _amount;
    }

    /// @notice Owner funds the contract with ETH for rewards
    function fundRewards() public payable onlyOwner {}

    /// @notice Owner withdraws remaining ETH
    function withdraw() public onlyOwner {
        (bool ok, ) = payable(owner).call{value: address(this).balance}("");
        require(ok, "Withdraw failed");
    }

    // ---------- View Helpers ----------

    function getProposal(uint256 _proposalId) public view returns (Proposal memory) {
        return proposals[_proposalId];
    }

    function hasVoted(address _voter, uint256 _proposalId) public view returns (bool) {
        return voterRecords[_voter][_proposalId].hasVoted;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}


// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import "./BettingNFT.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract GhamPlatform is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) initializer public {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    address payable public treasuryProxy;
    // Mapping from competition ID to the competition contract address
    mapping(uint256 => address) public competitions;
    uint256 public competitionCounter;
    // Event for competition creation
    event CompetitionCreated(uint256 competitionId, address competitionAddress);

    /**
     * @dev Create a new competition by deploying a new BettinghamChampionsLeague contract.
     */
    function createCompetition(
        uint256 mintStartTime,
        uint256 mintEndTime
    ) external onlyOwner returns (address) {
        // Increment competition counter to generate unique competition IDs
        competitionCounter++;

        // Deploy new BettinghamChampionsLeague contract (Factory pattern)
        GhamCompetition newCompetition = new GhamCompetition(
            treasuryProxy,
            mintStartTime,
            mintEndTime,
            address(this)
        );

        // Store the competition contract in the platform
        competitions[competitionCounter] = address(newCompetition);

        // Emit event for competition creation
        emit CompetitionCreated(competitionCounter, address(newCompetition));

        return address(newCompetition);
    }

    /**
     * @dev Set winners for a specific competition.
     */
    function declareWinners(uint256 competitionId, uint256[] memory winners) external onlyOwner {
        address competitionAddress = competitions[competitionId];
        require(competitionAddress != address(0), "Competition does not exist");

        GhamCompetition competition = GhamCompetition(competitionAddress);
        competition.setWinners(winners);
    }

    /**
     * @dev Claim reward for a specific competition by burning winner NFTs.
     */
    function claimReward(uint256 competitionId, uint256 tokenId, uint256 amount) external {
        address competitionAddress = competitions[competitionId];
        require(competitionAddress != address(0), "Competition does not exist");

        GhamCompetition competition = GhamCompetition(competitionAddress);
        competition.burnAndClaim(tokenId, amount);
    }

    /**
     * @dev Withdraw funds from the platform's balance (e.g., platform revenue).
     */
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Not enough funds");
        to.transfer(amount);
    }

    // Function to receive ETH
    receive() external payable {}
}
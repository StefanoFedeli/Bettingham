// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "hardhat/console.sol";

contract GhamCompetition is ERC1155, ERC1155Supply, Ownable {
    uint64 public MAX_TEAMS;
    uint256 public mintStartTime;
    uint256 public mintEndTime;
    uint256 public constant MINT_PRICE = 0.1 ether;
    address payable public treasury;
    uint256 public winnerSetTime;
    mapping(uint64 => uint256) public winnerRewards;
    bool public winnersSet;

    constructor(
        address payable _treasury,
        uint256 _mintStartTime,
        uint256 _mintEndTime,
        uint64 _maxTeams,
        address initialOwner
    )
        ERC1155("https://bettingham.ch/games/competitions/1/{id}")
        Ownable(initialOwner)
    {   
        require(_mintStartTime < _mintEndTime);
        require(_treasury != address(0));

        treasury = _treasury;
        mintStartTime = _mintStartTime;
        mintEndTime = _mintEndTime;
        MAX_TEAMS = _maxTeams;
    }

    /**
     * @dev Mint tokens for a specific team.
     * @param account The address to mint to.
     * @param id The token ID (team ID) to mint.
     * @param amount The number of tokens to mint.
     * @param data Additional data.
     */
    function mint(address account, uint256 id, uint256 amount, bytes memory data) external payable {
        require(id > 0 && id <= MAX_TEAMS);
        require(block.timestamp >= mintStartTime);
        require(block.timestamp <= mintEndTime);
        require(msg.value == MINT_PRICE * amount);

        // Transfer funds to the treasury
        (bool success, ) = treasury.call{value: 0.02 ether * amount}("");
        require(success);

        // Mint the token(s)
        _mint(account, id, amount, data);
    }

    /**
     * @dev Mint multiple tokens in a single transaction.
     * @param to The address to mint to.
     * @param ids The array of token IDs to mint.
     * @param amounts The array of token amounts to mint.
     * @param data Additional data.
     */
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external payable {
        // Calculate total payment required
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            require(ids[i] > 0 && ids[i] <= MAX_TEAMS);
            totalAmount += amounts[i];
        }
        require(block.timestamp >= mintStartTime);
        require(block.timestamp <= mintEndTime);
        require(msg.value == MINT_PRICE * totalAmount);

        // Transfer funds to the treasury
        (bool success, ) = treasury.call{value: 0.02 ether * totalAmount}("");
        require(success);

        _mintBatch(to, ids, amounts, data);
    }

    /**
     * @dev Burn a winner NFT and claim the reward.
     * @param id The token ID to burn.
     * @param amount The number of NFTs to burn.
     */
    function burnAndClaim(address addr, uint64 id, uint256 amount) external onlyOwner {
        require(winnersSet);
        require(block.timestamp >= winnerSetTime + 2 weeks);
        require(winnerRewards[id] > 0);

        // Burn the tokens
        _burn(addr, id, amount);

        // Calculate the reward
        uint256 reward = winnerRewards[id] * amount;

        // Transfer the reward
        (bool success, ) = msg.sender.call{value: reward}("");
        require(success);
    }

     /**
     * @dev Swipe any remaining contract balance after one year since winners were set.
     */
    function swipe() external onlyOwner {
        require(winnersSet);
        require(block.timestamp >= winnerSetTime + 365 days);

        uint256 remainingBalance = address(this).balance;
        require(remainingBalance > 0);

        // Transfer the remaining balance to the owner
        (bool success, ) = msg.sender.call{value: remainingBalance}("");
        require(success);
    }


    /**
     * @dev Set the list of winners and calculate ETH rewards per NFT dynamically.
     * @param winners The list of winner IDs.
     */
    function setWinners(uint64[] memory winners) external onlyOwner {
        require(!winnersSet);
        require(block.timestamp >= mintEndTime);
        require(winners.length > 0);

        uint256 totalWinnerSupply = 0;

        // Calculate the total number of winning NFTs
        for (uint256 i = 0; i < winners.length; i++) {
            require(winners[i] > 0 && winners[i] <= MAX_TEAMS);
            uint256 supply = totalSupply(winners[i]);
            totalWinnerSupply += supply;
        }
        require(totalWinnerSupply > 0);

        // Calculate rewards per NFT
        uint256 rewardPerNFT = address(this).balance / totalWinnerSupply;
        for (uint256 i = 0; i < winners.length; i++) {
            winnerRewards[winners[i]] = rewardPerNFT;
        }

        winnerSetTime = block.timestamp;
        winnersSet = true;
    }

    /**
     * @dev Override URI for dynamic metadata.
     * @param tokenId The token ID.
     * @return The URI for the token.
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(tokenId > 0 && tokenId <= MAX_TEAMS);
        return string(abi.encodePacked(super.uri(tokenId)));
    }

    // The following functions are overrides required by Solidity.
    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }
}

const { expect } = require("chai");
const { getIcapAddress } = require("ethers");
const { ethers } = require("hardhat");

async function helperBlockTimestamp(days) {
    const currentTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
    // Set the block timestamp to 1 day in the future (for example)
    const futureTimestamp = currentTimestamp + (86400 * days); // 86400 seconds = 1 day
    // Set the block's timestamp for the next block
    await ethers.provider.send("evm_setNextBlockTimestamp", [futureTimestamp]);
    // Mine the block with the new timestamp
    await ethers.provider.send("evm_mine", []); // This mines the block with the new timestamp
}



describe("GhamCompetition Contract", function () {
  let GhamCompetition, ghamCompetition;
  let owner, user1, user2, treasury;

  const MAX_TEAMS = 10;
  const MINT_PRICE = ethers.parseEther("0.1");
  const TREASURY_SHARE = ethers.parseEther("0.02");
  const URI = "https://bettingham.ch/games/competitions/1/{id}";
  const mintStartTime = Math.floor(Date.now() / 1000) + 86400; // Starts in 1 day
  const mintEndTime = mintStartTime + 86400 * 3; // Ends 3 days later

  beforeEach(async function () {
    [owner, user1, user2, treasury] = await ethers.getSigners();

    await hre.network.provider.send("hardhat_reset")

    // Deploy the contract
    const GhamCompetitionFactory = await ethers.getContractFactory("GhamCompetition");
    ghamCompetition = await GhamCompetitionFactory.deploy(
      treasury.address,
      mintStartTime,
      mintEndTime,
      MAX_TEAMS,
      owner.address
    );
    await ghamCompetition.waitForDeployment()
  });

  it("Should deploy with correct initial parameters", async function () {
    expect(await ghamCompetition.MAX_TEAMS()).to.equal(MAX_TEAMS);
    expect(await ghamCompetition.mintStartTime()).to.equal(mintStartTime);
    expect(await ghamCompetition.mintEndTime()).to.equal(mintEndTime);
    expect(await ghamCompetition.uri(1)).to.equal(URI);
    expect(await ghamCompetition.treasury()).to.equal(treasury.address);
  });

  describe("Minting", function () {
    it("Should allow valid minting and send funds to the treasury", async function () {
      // Travel to minting period
      await ethers.provider.send("evm_setNextBlockTimestamp", [mintStartTime + 10]);
      await ethers.provider.send("evm_mine");

      const teamId = BigInt(1);
      const amount = BigInt(3);
      const payment = MINT_PRICE * amount;

      await expect(() =>
        ghamCompetition.connect(user1).mint(user1.address, teamId, amount, "0x", { value: payment })
      ).to.changeEtherBalance(treasury, TREASURY_SHARE * amount);

      expect(await ghamCompetition.balanceOf(user1.address, teamId)).to.equal(amount);
    });

    it("Should revert if minting outside the mint period", async function () {
      const teamId = 1;
      const amount = 1;

      await expect(
        ghamCompetition.connect(user1).mint(user1.address, teamId, amount, "0x", { value: MINT_PRICE })
      ).to.be.reverted;

      // Travel past the minting period
      await ethers.provider.send("evm_setNextBlockTimestamp", [mintEndTime + 10]);
      await ethers.provider.send("evm_mine");

      await expect(
        ghamCompetition.connect(user1).mint(user1.address, teamId, amount, "0x", { value: MINT_PRICE })
      ).to.be.reverted;
    });

    it("Should revert if incorrect ETH amount is sent", async function () {
      // Travel to minting period
      await ethers.provider.send("evm_setNextBlockTimestamp", [mintStartTime + 10]);
      await ethers.provider.send("evm_mine");

      const teamId = 1;
      const amount = 2;

      await expect(
        ghamCompetition.connect(user1).mint(user1.address, teamId, amount, "0x", { value: MINT_PRICE * BigInt(amount) - BigInt(1) })
      ).to.be.reverted;
    });
  });

  describe("Batch Minting", function () {
    it("Should allow batch minting", async function () {
      // Travel to minting period
      await ethers.provider.send("evm_setNextBlockTimestamp", [mintStartTime + 10]);
      await ethers.provider.send("evm_mine");

      const ids = [1, 2, 3];
      const amounts = [1, 2, 1];
      const totalPayment = MINT_PRICE * BigInt(amounts.reduce((a, b) => a + b, 0));

      await ghamCompetition.connect(user1).mintBatch(user1.address, ids, amounts, "0x", { value: totalPayment });

      for (let i = 0; i < ids.length; i++) {
        expect(await ghamCompetition.balanceOf(user1.address, ids[i])).to.equal(amounts[i]);
      }
    });

    it("Should revert if one of the team IDs is invalid", async function () {
      // Travel to minting period
      await ethers.provider.send("evm_setNextBlockTimestamp", [mintStartTime + 10]);
      await ethers.provider.send("evm_mine");

      const ids = [1, 2, 11]; // 11 is invalid
      const amounts = [1, 2, 1];
      const totalPayment = MINT_PRICE * BigInt(amounts.reduce((a, b) => a + b, 0));

      await expect(
        ghamCompetition.connect(user1).mintBatch(user1.address, ids, amounts, "0x", { value: totalPayment })
      ).to.be.reverted;
    });
  });

  describe("Winners and Rewards", function () {
    it("Should set winners and calculate rewards", async function () {

      const teamId = 1;
      const winners = [teamId];
      const tokensBought = BigInt(2);
      const ethLeft = ethers.parseEther("0.16")
      const calculatedReward = ethLeft / tokensBought;

      // Mint NFTs for user1
      await helperBlockTimestamp(2);
      await ghamCompetition.connect(user1).mint(user1.address, teamId, tokensBought, "0x", { value: MINT_PRICE * tokensBought });

      // Send ETH to contract
      await helperBlockTimestamp(2);
        await ghamCompetition.connect(owner).setWinners(winners);
    
      

      expect(await ghamCompetition.winnerRewards(teamId)).to.equal(calculatedReward);
    });

    it("Should allow claiming rewards after the claim period", async function () {
      // Travel past minting end time and set winners
      const teamId = 1;
      const tokensBought = BigInt(2);
      const ethLeft = ethers.parseEther("0.16")
      const calculatedReward = ethLeft / tokensBought;

      // Mint NFTs for user1
      await helperBlockTimestamp(2);
      await ghamCompetition.connect(user1).mint(user1.address, teamId, tokensBought, "0x", { value: MINT_PRICE * tokensBought });

      await helperBlockTimestamp(2);
      await ghamCompetition.connect(owner).setWinners([teamId]);

      // Travel past claim start time
      await helperBlockTimestamp(20);
      await expect(() => ghamCompetition.connect(owner).burnAndClaim(user1.address, teamId, 1))
        .to.changeEtherBalance(owner,calculatedReward );
    });
  });
});

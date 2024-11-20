const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");


async function helperBlockTimestamp(days) {
    const currentTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
    // Set the block timestamp to 1 day in the future (for example)
    const futureTimestamp = currentTimestamp + (86400 * days); // 86400 seconds = 1 day
    // Set the block's timestamp for the next block
    await ethers.provider.send("evm_setNextBlockTimestamp", [futureTimestamp]);
    // Mine the block with the new timestamp
    await ethers.provider.send("evm_mine", []); // This mines the block with the new timestamp
}



describe("GhamPlatform Contract", function () {
  let platform, competition, treasury;
  let owner, otherUser;
  let mintStartTime, mintEndTime;

  beforeEach(async function () {
    [owner, otherUser] = await ethers.getSigners();

    await hre.network.provider.send("hardhat_reset")

    mintStartTime = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
    mintEndTime = mintStartTime + (86400 * 3); // 3 days from start time

    // Deploy the Treasury Proxy
    const TreasuryFactory = await ethers.getContractFactory("GhamTreasury");
    treasury = await upgrades.deployProxy(TreasuryFactory, [owner.address], {
      initializer: "initialize",
    });
    await treasury.waitForDeployment();

    // Deploy the GhamPlatform Proxy
    const PlatformFactory = await ethers.getContractFactory("GhamPlatform");
    platform = await upgrades.deployProxy(PlatformFactory, [owner.address, await treasury.getAddress()], {
      initializer: "initialize",
    });
    await platform.waitForDeployment();
  });

  it("should initialize the platform contract correctly", async function () {
    expect(await platform.owner()).to.equal(owner.address);
  });

  it("should create a new competition", async function () {
    const tx = await platform
      .connect(owner)
      .createCompetition(mintStartTime, mintEndTime, 16);
    await ethers.provider.send("evm_mine", []); 
    const receipt = await tx.wait();

    // Check the event emitted
    const event = receipt.logs.find(log => log.fragment.name === 'CompetitionCreated');
    expect(event).to.exist;

    const competitionId = event.args[0];
    const competitionAddress = event.args[1];

    expect(competitionId).to.equal(1);
    expect(competitionAddress).to.properAddress;

    // Verify the competition mapping
    const storedCompetition = await platform.competitions(competitionId);
    expect(storedCompetition).to.equal(competitionAddress);
  });

  it("should allow declaring winners for a competition", async function () {
    // Create a new competition
    const tx = await platform
      .connect(owner)
      .createCompetition(mintStartTime, mintEndTime ,4);
    await ethers.provider.send("evm_mine", []); 
    const receipt = await tx.wait();

    const competitionId = receipt.logs.find(log => log.fragment.name === 'CompetitionCreated').args[0];

    const winners = [1, 2, 3];
    const competitionAddress = await platform.competitions(competitionId);
    competition = await ethers.getContractAt("GhamCompetition", competitionAddress);

    await helperBlockTimestamp(2);
    await competition
      .connect(owner)
      .mint(owner.address, winners[0], 10, ethers.toUtf8Bytes(""), { value: ethers.parseEther("1") });
    await ethers.provider.send("evm_mine", []);
    await helperBlockTimestamp(10);


    // Verify the winners were set in the competition contract
    await platform.connect(owner).declareWinners(competitionId,winners);
    expect(await competition.winnersSet()).to.be.true;
  });

  it("should allow claiming rewards for a competition", async function () {
    // Create a new competition
    const tx = await platform
      .connect(owner)
      .createCompetition(mintStartTime, mintEndTime, 6);
    const receipt = await tx.wait();

    const competitionId = receipt.logs.find(log => log.fragment.name === 'CompetitionCreated').args[0];
    const competitionAddress = await platform.competitions(competitionId);
    competition = await ethers.getContractAt("GhamCompetition", competitionAddress);

    // Mint NFTs
    const tokenId = 1;
    const amount = 1;
    await helperBlockTimestamp(2);
    await competition
      .connect(otherUser)
      .mint(otherUser.address, tokenId, amount,  ethers.toUtf8Bytes(""), { value: ethers.parseEther("0.1") });
    await ethers.provider.send("evm_mine", []);
    await helperBlockTimestamp(10);

    // Declare winners
    await platform.connect(owner).declareWinners(competitionId, [tokenId]);

    // Advance time to allow claiming rewards
    await helperBlockTimestamp(25);

    // Claim rewards
    const claimTx = await platform
      .connect(otherUser)
      .claimReward(competitionId, tokenId, amount);
    await claimTx.wait();

    // Verify the NFT was burned and rewards claimed
    const balance = await competition.balanceOf(otherUser.address, tokenId);
    expect(balance).to.equal(0);
  });

  it("should allow the owner to withdraw funds", async function () {
    const depositAmount = ethers.parseEther("1.0");

    // Send some ETH to the platform
    await owner.sendTransaction({
      to: await platform.getAddress(),
      value: depositAmount,
    });

    const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

    // Withdraw funds
    const withdrawAmount = ethers.parseEther("0.5");
    await platform.connect(owner).withdraw(owner.address, withdrawAmount);

    // Verify the owner's balance increased
    const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
    expect(finalOwnerBalance - initialOwnerBalance).to.be.closeTo(
      withdrawAmount,
      ethers.parseUnits("0.01", "ether") // Allow some gas cost
    );

    // Verify the platform's balance decreased
    const platformBalance = await ethers.provider.getBalance(await platform.getAddress());
    expect(platformBalance).to.equal(depositAmount - withdrawAmount);
  });

  it("should reject non-owner from withdrawing funds", async function () {
    await expect(
      platform.connect(otherUser).withdraw(otherUser.address, ethers.parseEther("1"))
    ).to.be.reverted
  });

  it("should accept ETH sent directly to the contract", async function () {
    const depositAmount = ethers.parseEther("1.0");

    // Send ETH directly
    await owner.sendTransaction({
      to: await platform.getAddress(),
      value: depositAmount,
    });

    // Verify the balance
    const platformBalance = await ethers.provider.getBalance(await platform.getAddress());
    expect(platformBalance).to.equal(depositAmount);
  });
});

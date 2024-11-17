const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
//const { upgrades } = require("openzeppelin-hardhat-upgrades");


async function helperBlockTimestamp(days) {
    const currentTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
    // Set the block timestamp to 1 day in the future (for example)
    const futureTimestamp = currentTimestamp + (86400 * days); // 86400 seconds = 1 day
    // Set the block's timestamp for the next block
    await ethers.provider.send("evm_setNextBlockTimestamp", [futureTimestamp]);
    // Mine the block with the new timestamp
    await ethers.provider.send("evm_mine", []); // This mines the block with the new timestamp
}

describe("GhamTreasury Contract", function () {
    let owner, otherAccount;
    let treasury;

    beforeEach(async function () {
        // Get signers
        [owner, otherAccount] = await ethers.getSigners();

        // Deploy the GhamTreasury contract
        const Treasury = await ethers.getContractFactory("GhamTreasury");
        treasury = await upgrades.deployProxy(Treasury, [owner.address], { initializer: "initialize" });
        await treasury.waitForDeployment();
        const proxyAddress = await treasury.getAddress();

        // Ensure the deployment was successful
        if (!proxyAddress) {
            throw new Error("Proxy deployment failed, address is undefined.");
        }
  
        console.log("Deployed Treasury Proxy Address: ", proxyAddress);
    
        // Fetch the implementation contract address (where the logic resides)
        const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
        console.log("Deployed Implementation Address: ", implementationAddress);
            
    });

    it("should verify the proxy address", async function () {
        // You can now use `treasury.address` in your tests
        expect(await treasury.getAddress()).to.be.a('string');
        expect(await treasury.getAddress()).to.not.be.null;
      });

    describe("Depositing funds", function () {
        it("should allow the owner to deposit funds", async function () {
            const depositAmount = ethers.parseEther("1"); // 1 ETH

            await expect(() => treasury.connect(owner).deposit({ value: depositAmount }))
                .to.changeEtherBalances([owner, treasury], [-depositAmount, depositAmount]);

            // Check that the deposit event was emitted
            await expect(treasury.connect(owner).deposit({ value: depositAmount }))
                .to.emit(treasury, "FundsDeposited")
                .withArgs(owner.address, depositAmount);
        });

        it("should reject deposits from non-owner", async function () {
            const depositAmount = ethers.parseEther("1"); // 1 ETH
            await expect(treasury.connect(otherAccount).deposit({ value: depositAmount }))
                .to.be.reverted;
        });
    });

    describe("Withdrawing funds", function () {
        it("should allow the owner to withdraw 1% of the treasury balance", async function () {
            const depositAmount = ethers.parseEther("100"); // 100 ETH
            await treasury.connect(owner).deposit({ value: depositAmount });

            const withdrawAmount = depositAmount / BigInt(100); // 1% of 100 ETH

            await helperBlockTimestamp(60)
            await expect(() =>
                treasury.connect(owner).withdraw(withdrawAmount)
            ).to.changeEtherBalances([owner, treasury], [withdrawAmount, -withdrawAmount]);

            await helperBlockTimestamp(45)
            // Check that the withdrawal event was emitted
            await expect(treasury.connect(owner).withdraw(withdrawAmount-BigInt(10**16)))
                .to.emit(treasury, "FundsWithdrawn")
                .withArgs(owner.address, withdrawAmount-BigInt(10**16));
        });

        it("should reject withdrawals exceeding 1% of the balance", async function () {
            const depositAmount = ethers.parseEther("100"); // 100 ETH
            await treasury.connect(owner).deposit({ value: depositAmount });

            const withdrawAmount = depositAmount* BigInt(2) / BigInt(100); // 2% of 100 ETH (exceeds the 1% limit)

            await expect(treasury.connect(owner).withdraw(withdrawAmount))
                .to.be.revertedWithoutReason();
        });

        it("should reject withdrawals if 30 days have not passed since last withdrawal", async function () {
            const depositAmount = ethers.parseEther("100"); // 100 ETH
            await treasury.connect(owner).deposit({ value: depositAmount });

            const withdrawAmount = depositAmount / BigInt(100); // 1% of 100 ETH

            await helperBlockTimestamp(45)
            // First withdrawal
            await treasury.connect(owner).withdraw(withdrawAmount);

            // Try to withdraw again within 30 days
            await expect(treasury.connect(owner).withdraw(withdrawAmount))
                .to.be.revertedWithoutReason();
        });
    });

    describe("Balance checks", function () {
        it("should return the correct current balance", async function () {
            const depositAmount = ethers.parseEther("50"); // 50 ETH
            await treasury.connect(owner).deposit({ value: depositAmount });

            const balance = await treasury.getBalance();
            expect(balance).to.equal(depositAmount);
        });
    });

    describe("Withdraw function with contract balance", function () {
        it("should allow the owner to withdraw the correct amount after 30 days", async function () {
            const depositAmount = ethers.parseEther("100"); // 100 ETH
            await treasury.connect(owner).deposit({ value: depositAmount });

            const withdrawAmount = depositAmount / BigInt(100); // 1% of 100 ETH

            // Fast forward 30 days
            await network.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]); // 30 days in seconds
            await network.provider.send("evm_mine");

            await expect(() =>
                treasury.connect(owner).withdraw(withdrawAmount)
            ).to.changeEtherBalances([owner, treasury], [withdrawAmount, -withdrawAmount]);
        });
    });

    describe("ETH sent directly to contract", function () {
        it("should accept ETH sent directly and trigger the deposit event", async function () {
            const depositAmount = ethers.parseEther("1"); // 1 ETH
    
            // Check the initial balance
            const initialBalance = await treasury.connect(owner).getBalance();
            expect(initialBalance).to.equal(0);

            await owner.sendTransaction({
                to: await treasury.getAddress(),
                value: depositAmount
            })
    
            // Send ETH directly to the contract
            const newBalance = await treasury.connect(owner).getBalance();
            expect(newBalance).to.equal(depositAmount);
           
    
            // Check that the deposit event was emitted
            await expect(owner.sendTransaction({
                to: await treasury.getAddress(),
                value: depositAmount
            })).to.emit(treasury, "FundsDeposited").withArgs(owner.address, depositAmount);
    
            // Ensure the balance of the contract reflects the deposit
            const finalBalance = await treasury.connect(owner).getBalance();
            expect(finalBalance).to.equal(depositAmount*BigInt(2));
            
        });
    });
    
});

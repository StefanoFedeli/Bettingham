<template>
    <div>
      <h1>Gham Competition</h1>
      <div>
        <p><b>Contract Address:</b> {{ contractAddress }}</p>
        <p><b>Max Teams:</b> {{ maxTeams }}</p>
        <p><b>Mint Start Time:</b> {{ mintStartTime }}</p>
        <p><b>Mint End Time:</b> {{ mintEndTime }}</p>
        <p><b>Mint Price:</b> {{ mintPrice }} ETH</p>
      </div>
  
      <button @click="connectWallet">Connect Wallet</button>
      <p><b>Connected Account:</b> {{ userAddress }}</p>
  
      <div>
        <h2>Actions</h2>
        <button @click="mintToken">Mint Token</button>
        <button @click="fetchBalance">Fetch Balance</button>
      </div>
  
      <p v-if="balance !== null"><b>Token Balance:</b> {{ balance }}</p>
    </div>
  </template>
  
  <script>
  import Web3 from "web3";
  
  export default {
    data() {
      return {
        contractAddress: "0xYourContractAddressHere", // Replace with deployed contract address
        abi: [
          // Replace with GhamCompetition ABI
          // Example:
          {
            "inputs": [],
            "name": "MAX_TEAMS",
            "outputs": [{ "internalType": "uint64", "name": "", "type": "uint64" }],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "mintStartTime",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "mintEndTime",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "MINT_PRICE",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": ["address", "uint256", "uint256", "bytes"],
            "name": "mint",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function",
          },
          {
            "inputs": ["address", "uint256"],
            "name": "balanceOf",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function",
          },
        ],
        web3: null,
        contract: null,
        userAddress: null,
        maxTeams: null,
        mintStartTime: null,
        mintEndTime: null,
        mintPrice: null,
        balance: null,
      };
    },
    methods: {
      async connectWallet() {
        if (window.ethereum) {
          try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            this.web3 = new Web3(window.ethereum);
            const accounts = await this.web3.eth.getAccounts();
            this.userAddress = accounts[0];
            this.contract = new this.web3.eth.Contract(this.abi, this.contractAddress);
            await this.fetchContractDetails();
          } catch (error) {
            console.error("Error connecting wallet:", error);
          }
        } else {
          alert("MetaMask not detected. Please install MetaMask.");
        }
      },
      async fetchContractDetails() {
        if (this.contract) {
          this.maxTeams = await this.contract.methods.MAX_TEAMS().call();
          this.mintStartTime = new Date((await this.contract.methods.mintStartTime().call()) * 1000).toLocaleString();
          this.mintEndTime = new Date((await this.contract.methods.mintEndTime().call()) * 1000).toLocaleString();
          this.mintPrice = this.web3.utils.fromWei(await this.contract.methods.MINT_PRICE().call(), "ether");
        }
      },
      async mintToken() {
        if (!this.contract || !this.userAddress) {
          alert("Connect your wallet first.");
          return;
        }
        const teamId = 1; // Replace with your desired team ID
        const amount = 1; // Replace with the amount of tokens to mint
        const mintPrice = this.web3.utils.toWei(this.mintPrice, "ether");
        const value = mintPrice * amount;
  
        try {
          await this.contract.methods
            .mint(this.userAddress, teamId, amount, "0x")
            .send({ from: this.userAddress, value });
          alert("Mint successful!");
        } catch (error) {
          console.error("Mint failed:", error);
          alert("Mint failed. Check the console for more details.");
        }
      },
      async fetchBalance() {
        if (!this.contract || !this.userAddress) {
          alert("Connect your wallet first.");
          return;
        }
        const teamId = 1; // Replace with the team ID you want to check
        try {
          const balance = await this.contract.methods.balanceOf(this.userAddress, teamId).call();
          this.balance = balance;
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  h1 {
    font-size: 24px;
  }
  button {
    margin: 5px 0;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
  }
  p {
    font-size: 14px;
  }
  </style>
  
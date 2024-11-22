<template>
  <!-- Header -->
  <Header />
  <div class="competition-details">
    <!-- Main Banner -->
    <div class="main-banner" :style="{ background: randomGradient }">
      <div class="banner-content">
        <h1 class="competition-title">{{ title }}</h1>
        <div class="competition-info">
          <p><strong>Start Date:</strong> {{ startDate }}</p>
          <p><strong>End Date:</strong> {{ endDate }}</p>
          <p><strong>Cost of Bet:</strong> {{ costOfBet }} ETH</p>
          <p><strong>Winner Declared On:</strong> {{ winnerDate }}</p>
        </div>
        <div class="total-value-locked">
          <h3>Total Value Locked</h3>
          <p>{{ totalValueLocked }} ETH</p>
        </div>
      </div>
    </div>

    <!-- Red Carpet Section (Wallet Connected NFTs) -->
    <div v-if="isWalletConnected" class="user-nfts-section">
      <div class="red-carpet">
        <h2>Your Minted NFTs</h2>
        <UserNFTs :nfts="userNFTs" />
      </div>
    </div>

    <!-- NFTs Available to Bet -->
    <div class="nfts-available">
      <h2>NFTs Available to Bet On</h2>
      <div class="nft-cards">
        <NFTCard 
          v-for="(nft, index) in nfts" 
          :key="index" 
          :nft="nft" 
          @mint="mintNFT(nft)"
        />
      </div>
    </div>
  </div>
  <!-- Footer -->
  <Footer />
</template>

<script>
import Web3 from "web3";
import NFTCard from "@/components/NFTCard.vue";
import UserNFTs from "@/components/UserNFTs.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  props: {
    title: String,
    startDate: String,
    endDate: String,
    costOfBet: String,
    winnerDate: String,
    totalValueLocked: String,
    nfts: Array,  // Array of NFTs available to mint
    userNFTs: Array,  // Array of NFTs the user has minted
    isWalletConnected: Boolean,
  },
  components: {
    Header,
    Footer,
    NFTCard,
    UserNFTs,
  },
  data() {
    return {
      web3: null, // Web3 instance
      contract: null, // Smart contract instance
      account: null, // User's account address
      competitionContractAddress: "YOUR_CONTRACT_ADDRESS", // Replace with actual contract address
      competitionContractABI: [/* ABI of your contract */], // Replace with actual ABI
      nfts: [1], // NFTs available to mint
      userNFTs: [1], // NFTs user has minted
      isWalletConnected: false,
      randomGradient: this.getRandomGradient(), // Random gradient for the banner
    };
  },
  computed: {
    bannerStyle() {
      return {
        background: this.randomGradient, // Apply the random gradient to the banner
      };
    },
  },
  mounted() {
    this.connectToWallet();
  },
  methods: {
    // Get a random gradient from a predefined list
    getRandomGradient() {
      const gradients = [
        'linear-gradient(135deg, #ff7e5f, #feb47b)',  // Peach to Orange
        'linear-gradient(135deg, #6a11cb, #2575fc)',  // Purple to Blue
        'linear-gradient(135deg, #ff0099, #493240)',  // Pink to Dark Purple
        'linear-gradient(135deg, #36d1dc, #5b86e5)',  // Cyan to Blue
        'linear-gradient(135deg, #f5af19, #f12711)',  // Yellow to Red
        'linear-gradient(135deg, #d9a7c7, #fffcdc)',  // Light Pink to Beige
        'linear-gradient(135deg, #b3cdd1, #4e9ca9)'   // Light Blue to Teal
      ];
      const randomIndex = Math.floor(Math.random() * gradients.length);
      return gradients[randomIndex];
    },
    
    // Connect to MetaMask wallet
    async connectToWallet() {
      if (window.ethereum) {
        this.web3 = new Web3(window.ethereum);
        
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          this.account = (await this.web3.eth.getAccounts())[0];
          this.isWalletConnected = true;
          
          // Set up the contract instance
          this.contract = new this.web3.eth.Contract(
            this.competitionContractABI,
            this.competitionContractAddress
          );
          
          // Fetch competition data and NFTs
          await this.fetchCompetitionData();
          await this.fetchUserNFTs();
        } catch (error) {
          console.error("User denied account access or error occurred", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    },

    // Fetch competition data from the blockchain (e.g., start date, end date, total value locked)
    async fetchCompetitionData() {
      try {
        this.startDate = await this.contract.methods.getStartDate().call();
        this.endDate = await this.contract.methods.getEndDate().call();
        this.costOfBet = await this.contract.methods.getCostOfBet().call();
        this.winnerDate = await this.contract.methods.getWinnerDate().call();
        this.totalValueLocked = await this.contract.methods.getTotalValueLocked().call();
        
        const nftCount = await this.contract.methods.getNFTCount().call();
        this.nfts = [];

        for (let i = 0; i < nftCount; i++) {
          const nft = await this.contract.methods.getNFT(i).call();
          this.nfts.push(nft);
        }
      } catch (error) {
        console.error("Error fetching competition data:", error);
      }
    },

    // Fetch the user's minted NFTs from the blockchain
    async fetchUserNFTs() {
      try {
        const mintedNFTs = await this.contract.methods.getUserNFTs(this.account).call();
        this.userNFTs = mintedNFTs.map((nft) => ({
          ...nft,
          image: `https://path_to_nft_images/${nft.id}.jpg`, // Example, adjust according to your contract
        }));
      } catch (error) {
        console.error("Error fetching user NFTs:", error);
      }
    },

    // Mint the selected NFT
    async mintNFT(nft) {
      try {
        const tx = await this.contract.methods.mintNFT(nft.id).send({
          from: this.account,
          value: this.web3.utils.toWei(nft.price, "ether"),
        });
        alert("Minting successful!");
      } catch (error) {
        console.error("Error minting NFT:", error);
        alert("Minting failed!");
      }
    },
  },
};
</script>


<style scoped>
.competition-details {
  font-family: 'Poppins', sans-serif;
  color: #fff;
}

.main-banner {
  position: relative;
  height: 300px;
  display: flex;
  align-items: center;
  padding: 20px;
  color: white;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.competition-title {
  font-size: 48px;
  font-weight: bold;
}

.competition-info {
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 8px;
}

.total-value-locked {
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
}

.user-nfts-section {
  margin-top: 40px;
}

.red-carpet {
  background: #ff0000;
  color: white;
  padding: 20px;
  margin: 40px 0;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
}

.nfts-available {
  margin-top: 40px;
}

.nft-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>

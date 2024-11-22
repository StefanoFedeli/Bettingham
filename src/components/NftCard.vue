<template>
  <div class="nft-card">
    <img :src="nft.imageUrl" alt="NFT Image" class="nft-image" />
    <div class="nft-details">
      <h3 class="nft-name">{{ nft.name }}</h3>
      <p class="nft-price">{{ nft.price }} ETH</p>
      <p class="nft-minted">{{ nft.mintedCount }} minted</p>
      <button class="mint-button" @click="mintNFT">Mint</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nft: Object,
  },
  methods: {
    mintNFT() {
      this.$emit('mint', this.nft);
    },
  },
};
</script>

<style scoped>
.nft-card {
  background: #fff;
  border-radius: 8px;
  width: 200px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.nft-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.nft-details {
  padding: 10px;
}

.nft-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.nft-price, .nft-minted {
  font-size: 14px;
  color: #777;
}

.mint-button {
  margin-top: 10px;
  padding: 8px 15px;
  background-color: #ffb800;
  border: none;
  color: white;
  cursor: pointer;
}

.mint-button:hover {
  background-color: #ffc966;
}
</style>

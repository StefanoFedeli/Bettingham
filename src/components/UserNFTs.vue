<template>
    <div class="user-nfts">
      <div v-for="(nft, index) in nfts" :key="index" class="user-nft-card">
        <img :src="nft.imageUrl" alt="NFT Image" class="nft-image" />
        <div class="nft-details">
          <h3 class="nft-name">{{ nft.name }}</h3>
          <p class="nft-price">{{ nft.price }} ETH</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      nfts: Array,
    },
  };
  </script>
  
  <style scoped>
  .user-nfts {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .user-nft-card {
    background: #fff;
    border-radius: 8px;
    width: 200px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  
  .nft-price {
    font-size: 14px;
    color: #777;
  }
  </style>
  
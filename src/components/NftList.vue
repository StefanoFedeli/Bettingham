<template>
    <ul>
      <li v-for="(nft, index) in nfts" :key="index">
        {{ index + 1 }}. {{ nft }}
      </li>
    </ul>
  </template>
  
  <script>
  export default {
    data() {
      return {
        nfts: ['NFT #1', 'NFT #2', 'NFT #3'], // Replace with blockchain data.
      };
    },
  };
  </script>
  
  <style>
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    padding: 0.5rem 0;
  }
  </style>
  
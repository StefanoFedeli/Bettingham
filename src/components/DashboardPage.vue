<template>
    <div>
      <Header />
      <main class="dashboard">
        <section class="competitions">
          <CompetitionCard title="Next Competition" />
          <CompetitionCard title="Coming Soon" isDisabled />
          <CompetitionCard title="Coming Soon" isDisabled />
        </section>
        <section class="nfts">
          <h3>Available NFTs</h3>
          <NftList />
          <button class="mint-button" @click="mintNft">Mint for 0.1 ETH</button>
        </section>
      </main>
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from './Header.vue';
  import Footer from './Footer.vue';
  import CompetitionCard from './CompetitionCard.vue';
  import NftList from './NftList.vue';
  
  export default {
    components: {
      Header,
      Footer,
      CompetitionCard,
      NftList,
    },
    methods: {
      mintNft() {
        alert('Mint functionality coming soon!');
      },
    },
  };
  </script>
  
  <style>
  .dashboard {
    padding: 2rem;
  }
  .competitions {
    display: flex;
    gap: 1rem;
  }
  .nfts {
    margin-top: 2rem;
  }
  .mint-button {
    margin-top: 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 5px;
  }
  </style>
  
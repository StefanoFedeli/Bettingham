<template>
    <div>
      <Header />
      <section class="hero">
        <img src="/stadium.png" alt="Stadium" class="hero-image" />
      </section>
      <main class="content">
        <div class="section">
          <img src="@/assets/nft-icon.png" alt="NFT Icon" class="icon" />
          <p>Select who you think will win the competition, buy their NFT, and get your prize when the competition is over.</p>
        </div>
        <div class="section">
          <h2>The first platform to bet P2P fully transparent on the blockchain</h2>
        </div>
        <div class="section">
          <img src="@/assets/trophy-icon.png" alt="Trophy Icon" class="icon" />
        </div>
      </main>
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from './Header.vue';
  import Footer from './Footer.vue';
  
  export default {
    components: {
      Header,
      Footer,
    },
  };
  </script>
  
<template>
    <div class="landing-page">
      <!-- Header -->
      <Header />
  
      <!-- Hero Section -->
      <section class="hero">
        <p class="hero-subtitle">The first platform to bet P2P fully transparent on the blockchain</p>
      </section>
  
      <section class="competitions">
        
        <CompetitionCard 
  title="Winter Championship" 
  mintEndsIn="10 Days" 
  prizePool="12.5 ETH" 
  winnersDate="Dec 30, 2024" 
/>
<CompetitionCard 
  title="Summer Cup" 
  mintEndsIn="20 Days" 
  prizePool="5.3 ETH" 
  winnersDate="Jan 15, 2025" 
  isDisabled
/>
<CompetitionCard 
  title="Spring League" 
  mintEndsIn="15 Days" 
  prizePool="8.7 ETH" 
  winnersDate="Feb 10, 2025" 
  isDisabled
/>

</section>

      <!-- Features -->
      <section class="features">
        <!-- Feature: Big Icon -->
        <FeatureBlock
          image="/assets/nft-icon.png"
          title="NFT Betting"
          description="Select who you think will win the competition, buy their NFT, and get your prize when the competition is over."
        />
  
        <!-- Feature: Trophy Icon -->
        <FeatureBlock
          image="/assets/trophy-icon.png"
          title="Win Big with Transparency"
          description="Compete in a fully transparent blockchain ecosystem, where every bet is secure and fair."
          :reverse="true"
        />
      </section>
  
      <!-- Footer -->
      <Footer />
    </div>
  </template>
  
  
  <script>
  import Header from "@/components/Header.vue";
  import Footer from "@/components/Footer.vue";
  import FeatureBlock from "@/components/FeatureBlock.vue";
  import CompetitionCard from "./CompetitionCard.vue";
  
  export default {
    components: {
      Header,
      Footer,
      CompetitionCard,
      FeatureBlock,
    },
  };
  </script>
  
  <style scoped>
/* Landing Page Styles */
.landing-page {
  background: linear-gradient(180deg, #f7f7f7, #e0e0f5);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero {
  text-align: center;
  padding: 60px 20px;
}

.hero-title {
  font-size: 64px;
  font-weight: bold;
  color: #3f3d56;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 24px;
  color: #555;
  font-family: 'Poppins', sans-serif;
  line-height: 1.5;
}

/* Competition Cards Section */
.competitions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Centers cards horizontally */
  gap: 20px; /* Space between cards */
  padding: 40px 20px;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box; /* Ensures padding doesn't affect layout */
}

/* Features Section */
.features {
  padding: 50px 20px;
  width: 100%;
  max-width: 1200px;
}
</style>

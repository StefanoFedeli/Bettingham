<template>
    <div 
      class="competition-card" 
      :class="{ disabled: isDisabled }" 
      @click="mintNow"
    >
      <div 
        class="backgrounding-t2" 
        :style="{ background: randomGradient }"
      >
        <div class="overlay"></div>
      </div>
      <div class="content">
        <h3 class="title">{{ title }}</h3>
        <p class="mint-timer">Mints ends in: <span>{{ mintEndsIn }}</span></p>
        <div class="prize-pool">
          <img src="../assets/eth-icon.png" alt="ETH Icon" class="eth-icon" />
          <span>{{ prizePool }}</span>
        </div>
        <p class="announcement-date">{{ winnersDate }}</p>
        <button class="mint-button" @click.stop="mintNow">Mint</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
      mintEndsIn: {
        type: String,
        default: "TBD",
      },
      prizePool: {
        type: String,
        default: "0 ETH",
      },
      winnersDate: {
        type: String,
        default: "TBD",
      },
      isDisabled: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        // Predefined gradient backgrounds
        gradients: [
          'linear-gradient(135deg, #ff7e5f, #feb47b)',  // Peach to Orange
          'linear-gradient(135deg, #6a11cb, #2575fc)',  // Purple to Blue
          'linear-gradient(135deg, #ff0099, #493240)',  // Pink to Dark Purple
          'linear-gradient(135deg, #36d1dc, #5b86e5)',  // Cyan to Blue
          'linear-gradient(135deg, #f5af19, #f12711)',  // Yellow to Red
          'linear-gradient(135deg, #d9a7c7, #fffcdc)',  // Light Pink to Beige
          'linear-gradient(135deg, #b3cdd1, #4e9ca9)'   // Light Blue to Teal
        ]
      };
    },
    computed: {
      // Choose a random gradient from the list
      randomGradient() {
        const randomIndex = Math.floor(Math.random() * this.gradients.length);
        return this.gradients[randomIndex];
      }
    },
    methods: {
        mintNow(event) {
            event.stopPropagation(); // Prevent redirect on card click
            // Navigate to the minting details page for the competition
            this.$router.push(`/competition/${this.title.toLowerCase().replace(/\s+/g, "-")}`);
        },
    },
  };
  </script>
  
  <style scoped>
  .competition-card {
    width: 100%;
    max-width: 350px;
    height: 300px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    background-color: #3f3d56;
    color: #fff;
    font-family: 'Poppins', sans-serif;
  }
  
  .competition-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  /* Disabled state styles */
  .competition-card.disabled {
    opacity: 0.5;
    pointer-events: none; /* Prevents clicking */
    background-color: #9e9e9e; /* Grays out the background */
  }
  
  .competition-card.disabled .title,
  .competition-card.disabled .mint-timer,
  .competition-card.disabled .prize-pool,
  .competition-card.disabled .announcement-date {
    color: #b0b0b0; /* Light gray text for disabled elements */
  }
  
  .competition-card.disabled .mint-button {
    background-color: #cfcfcf; /* Light gray button */
    cursor: not-allowed;
    pointer-events: none;
  }
  
  .backgrounding-t2 {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    z-index: 0; /* Ensure the background stays behind the content */
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4); /* Semi-transparent dark overlay */
  }
  
  .content {
    position: relative;
    z-index: 1; /* Content should be above the background */
    padding: 1px 15px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 80%;
  }
  
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 2px;
    color: #ffb800;
    text-align: center;
    line-height: 1.2;
  }
  
  .mint-timer {
    font-size: 12px;
    color: #fff;
    margin-bottom: 2px;
    line-height: 1.2;
  }
  
  .mint-timer span {
    color: #ffb800;
    font-weight: bold;
  }
  
  .prize-pool {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 4px;
  }
  
  .eth-icon {
    width: 16px;
    height: 16px;
  }
  
  .announcement-date {
    font-size: 12px;
    color: #cfcfcf;
    margin-top: 3px;
    line-height: 1.2;
  }
  
  .mint-button {
    margin-top: 2px;
    padding: 3px 14px;
    border-radius: 16px;
    background: #ffb800;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .mint-button:hover {
    background: #ffc966;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .competition-card {
      max-width: 100%;
      height: auto;
    }
  
    .title {
      font-size: 14px;
    }
  
    .prize-pool {
      font-size: 12px;
    }
  
    .mint-button {
      font-size: 10px;
    }
  }
  </style>
  
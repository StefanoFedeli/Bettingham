<template>
    <header class="app-header">
      <div class="logo" @click="goHome">BETTINGHAM</div>
      <button 
        v-if="!isConnected" 
        @click="showWalletOptions" 
        class="connect-button">
        Connect Wallet
      </button>
      <div v-else class="wallet-address">
        {{ formatAddress(walletAddress) }}
      </div>
  
      <!-- Modal for wallet options -->
      <div v-if="walletModalVisible" class="wallet-modal">
        <div class="modal-content">
          <h2>Select a Wallet</h2>
          <button @click="connectWithMetaMask" class="wallet-option metamask">
            <img src="@/assets/metamask-icon.png" alt="MetaMask" />
            MetaMask
          </button>
          <button @click="connectWithWalletConnect" class="wallet-option walletconnect">
            <img src="@/assets/walletconnect-icon.png" alt="WalletConnect" />
            WalletConnect
          </button>
          <button @click="closeWalletModal" class="close-button">Cancel</button>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isConnected: false,
        walletAddress: '',
        walletModalVisible: false,
      };
    },
    methods: {
      goHome() {
        this.$router.push('/');
      },
      showWalletOptions() {
        this.walletModalVisible = true;
      },
      closeWalletModal() {
        this.walletModalVisible = false;
      },
      async connectWithMetaMask() {
        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.walletAddress = accounts[0];
            this.isConnected = true;
            this.closeWalletModal();
          } catch (error) {
            console.error(error);
          }
        } else {
          alert('Please install MetaMask to connect your wallet.');
        }
      },
      async connectWithWalletConnect() {
        alert('WalletConnect integration coming soon!'); // Placeholder for actual implementation
      },
      formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
      },
    },
  };
  </script>
  
  <style scoped>
header {
  width: 100%;
  background-color: #3f3d56;
  color: white;
  padding: 20px 40px; /* Adjust this for more space on the sides */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 60px; /* Adjust padding for left/right space */
  background: linear-gradient(90deg, #6C63FF, #3F3D56);
  color: #fff;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box; /* Ensures padding is included in total width */
}

.logo {
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 20px; /* Add space between logo and other elements */
}

.connect-button {
  background-color: #FFB800;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 16px;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: 0.3s ease;
  margin-left: 20px; /* Add space between button and wallet address */
}

.connect-button:hover {
  background-color: #FFC966;
}

.wallet-address {
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  background: #fff;
  color: #3F3D56;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  margin-left: 20px; /* Adds space between button and address */
}

/* Modal styles */
.wallet-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px; /* Add padding for space from screen edges */
}

.modal-content {
  background: #fff;
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  width: 400px;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box; /* Ensures padding is included in total width */
}

.modal-content h2 {
  font-size: 22px;
  margin-bottom: 20px;
  color: #3F3D56;
}

/* Add general container styles */
body, html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

</style>

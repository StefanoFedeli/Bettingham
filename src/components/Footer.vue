<template>
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-logo" @click="goHome">BETTINGHAM</div>
        <div class="footer-links">
          <a href="https://docs.bettingham.com" target="_blank" class="footer-link">Docs</a>
          <a href="https://etherscan.io/address/0x123456..." target="_blank" class="footer-link">
            Contract
          </a>
        </div>
      </div>
      <div class="footer-copy">© 2024 Bettingham. All rights reserved.</div>
    </footer>
  </template>
  
  <script>
  export default {
    methods: {
      goHome() {
        this.$router.push('/');
      },
    },
  };
  </script>
  
  <style scoped>
  footer {
    width: 100%;
    background-color: #3f3d56;
  }
  
  .app-footer {
    background: linear-gradient(90deg, #3F3D56, #6C63FF);
    color: #fff;
    padding: 20px 10px; /* Adjusted padding for mobile compatibility */
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Poppins', sans-serif;
    box-sizing: border-box; /* Ensures proper box model handling */
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    padding: 0 20px; /* Add padding to prevent overflow */
    box-sizing: border-box; /* Ensures no extra width added by padding */
  }
  
  .footer-logo {
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .footer-links {
    display: flex;
    gap: 20px;
    flex-wrap: wrap; /* Ensures links wrap on smaller screens */
    justify-content: center; /* Centers links on smaller screens */
  }
  
  .footer-link {
    text-decoration: none;
    font-size: 16px;
    color: #ffb800;
    transition: color 0.3s ease;
  }
  
  .footer-link:hover {
    color: #ffc966;
  }
  
  .footer-copy {
    font-size: 14px;
    color: #ddd;
    text-align: center;
    margin-top: 10px; /* Spacing between links and copyright text */
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column; /* Stacks content vertically on small screens */
      text-align: center;
    }
  
    .footer-links {
      margin-top: 10px; /* Adds spacing between logo and links */
    }
  }
  
  @media (max-width: 480px) {
    .footer-copy {
      font-size: 12px; /* Adjusts text size for smaller screens */
    }
  }
  </style>
  
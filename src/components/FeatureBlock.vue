<template>
    <div class="feature-block" :class="{ reverse: reverse }">
      <img :src="image" alt="Feature image" class="feature-image" />
      <div class="feature-text">
        <h2 class="feature-title">{{ title }}</h2>
        <p class="feature-description">{{ description }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      image: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      reverse: {
        type: Boolean,
        default: false, // If true, text goes on the left, image on the right
      },
    },
  };
  </script>
  
  <style scoped>
  .feature-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    margin: 50px 0;
    padding: 20px;
  }
  
  .feature-block.reverse {
    flex-direction: row-reverse;
  }
  
  .feature-image {
    width: 45%;
    max-width: 500px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .feature-text {
    width: 50%;
    text-align: left;
  }
  
  .feature-title {
    font-size: 36px;
    font-weight: bold;
    color: #3f3d56;
    font-family: 'Poppins', sans-serif;
    margin-bottom: 20px;
  }
  
  .feature-description {
    font-size: 18px;
    line-height: 1.6;
    color: #555;
    font-family: 'Poppins', sans-serif;
  }
  </style>
  
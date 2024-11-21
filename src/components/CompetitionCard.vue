<template>
    <div class="card" :class="{ disabled: isDisabled }">
      <h3>{{ title }}</h3>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: String,
      isDisabled: {
        type: Boolean,
        default: false,
      },
    },
  };
  </script>
  
  <style>
  .card {
    padding: 1rem;
    border: 1px solid #ddd;
    text-align: center;
    border-radius: 8px;
  }
  .card.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  </style>
  
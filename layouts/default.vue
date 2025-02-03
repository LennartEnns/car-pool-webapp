<template>
  <slot />
</template>

<style>
  .border-card {
    border: 5px solid darkcyan;
  }
  .big-button {
    font-size: 2rem;
    display: flex;
    justify-content: center;

    padding: 5px;
    border: 5px solid darkcyan;
    border-radius: 15px;
  }
  .big-button:hover {
    background-color: darkslategray;
  }
</style>

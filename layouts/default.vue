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

  .responsive-font-size-1 {
    font-size: 16px;

    @media (min-width: 600px) {
      font-size: 18px;
    }

    @media (min-width: 960px) {
      font-size: 22px;
    }

    @media (min-width: 1264px) {
      font-size: 26px;
    }
  }
</style>

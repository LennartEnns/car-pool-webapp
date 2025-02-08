<template>
  <v-card class="border-card" :width="width" max-width="90%" variant="elevated">
    <v-card-title class="text-center text-h5 font-weight-bold">
      <span class="headline">{{ cardTitle }}</span>
    </v-card-title>
    <v-divider class="mx-3"/>
    <slot />
</v-card>
</template>

<script setup>
  defineProps({
    width: {
      type: String,
      required: false,
      default: '400px',
    },
    cardTitle: {
      type: String,
      required: true,
    },
  });
</script>

<style>

</style>
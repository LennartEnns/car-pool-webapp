<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>

<script setup>
  const title = 'Car Pool Cost Distributor';
  const description = 'Fair and flexible distribution of costs for your car pool!';

  useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description,
    ogLocale: 'en_US',
  });
</script>

<style>
  html {
    scroll-behavior: smooth;
  }
</style>

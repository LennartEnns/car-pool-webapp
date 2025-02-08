<template>
  <NuxtLayout name="after-login">
    <ClientOnly>
      {{ route }}
    </ClientOnly>

    <!-- Error Snackbar -->
    <v-snackbar v-model="showError" color="error" location="top" vertical timeout="4000">
      <div class="text-h6">Error</div>
      <p>{{ errorText }}</p>
    </v-snackbar>

    <!-- Overlay Loading Indicator -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate />
    </v-overlay>
  </NuxtLayout>
</template>

<script setup>
  const pageRoute = useRoute();

  const showError = ref(false);
  const errorText = ref('');
  const loading = ref(true);

  // Initial fetching
  const lazy = { lazy: true, server: false };
  const { data: route, status: routeFetchStatus } = await useApi('/api/routes', {
    ...lazy,
    query: { routeID: pageRoute.params.id },
  });

  // Watch fetch status
  const fetchErrorText = 'Error fetching route data';
  watch(routeFetchStatus, (status) => {
    loading.value = (status === 'pending');
    if (status === 'error') {
      errorText.value = fetchErrorText;
      showError.value = true;
    }
  });
</script>

<style>

</style>
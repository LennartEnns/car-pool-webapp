<template>
  <NuxtLayout name="after-login" ref="parentLayout">
    <v-sheet class="overflow-y-hidden" color="#333" width="100%" height="100%">
      <v-fab id="edit-fab" elevation="8" icon="mdi-plus" color="primary" location="bottom right" app style="bottom: 60px;" />
      <v-sheet v-if="selectedRole === 'driver'" class="d-flex flex-column align-center overflow-y-auto" width="100%" height="100%" color="transparent">
        <ClientOnly>
          <RoutesPreviewList cardTitle="My Routes" :routes="dRoutes" deletable @delete="onDeleteRoute" />
        </ClientOnly>
      </v-sheet>
      <v-sheet v-else class="d-flex flex-column align-center overflow-y-auto" width="100%" height="100%" color="transparent">
        <div style="font-size: 10rem; text-wrap: wrap;">Passenger Screen</div>
      </v-sheet>
      <v-bottom-navigation class="bottom-nav" v-model="selectedRole" grow color="cyan" bg-color="grey-darken-4">
        <v-btn value="driver">
          <v-icon size="xx-large">mdi-car</v-icon>
          <span class="nav-text">For Drivers</span>
        </v-btn>
        <v-btn value="passenger">
          <v-icon size="xx-large">mdi-car-seat</v-icon>
          <span class="nav-text">For Passengers</span>
        </v-btn>
      </v-bottom-navigation>
    </v-sheet>

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
  const { $api } = useNuxtApp();

  const selectedRole = ref('driver');
  const showError = ref(false);
  const errorText = ref('');
  const loading = ref(false);

  // Initial fetching
  const lazy = { lazy: true, server: false };
  // 'd' = driver, 'p' = passenger
  const { data: dRoutes, status: dRoutesStatus } = await useApi('/api/routes',
    { ...lazy, query: {
      preview: true,
    }}
  );

  // Watch fetch statuses, show error if any status is 'error'
  const fetchErrorText = 'Error fetching some data';
  watch(dRoutesStatus, (status) => {
    if (status === 'error') {
      errorText.value = fetchErrorText;
      showError.value = true;
    }
  });

  async function onDeleteRoute(index) {
    loading.value = true;

    $api('/api/routes', {
      method: 'DELETE',
      query: { routeID: dRoutes.value[index].routeID },
    })
    .then(() => {
      dRoutes.value.splice(index, 1);
    })
    .catch((error) => {
      switch (error.data?.statusCode) {
        default:
        errorText.value = 'Unexpected Error deleting route' + (error.data?.statusCode ? `: ${error.data.statusCode} ${error.data.statusText || ''}` : '');
        break;
      }
      showError.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
  }
</script>

<style scoped>
  .nav-text {
    font-size: 15px;
  }
  .bottom-nav {
    border-top: 2px solid grey;
  }
</style>

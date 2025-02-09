<template>
  <NuxtLayout name="after-login">
    <v-sheet class="overflow-y-hidden" color="#333" width="100%" height="100%">
      <v-fab id="edit-fab" elevation="8" icon="mdi-plus" color="primary" location="bottom right" app style="bottom: 60px;" />
      <v-sheet v-if="selectedRole === 'driver'" class="d-flex flex-column pb-4 overflow-y-auto" width="100%" height="100%" color="transparent">
        <v-row justify="center" no-gutters width="100%">
          <v-col :cols="cols">
            <ClientOnly>
              <RoutesPreviewList class="mx-auto" cardTitle="Routes" :route-data="dRoutes || []" deletable @delete="onDeleteRoute" />
            </ClientOnly>
          </v-col>
          <v-col :cols="cols">
            <ClientOnly>
              <VehiclesPreviewList class="mx-auto" cardTitle="Vehicles" :vehicles="testVehicles || []" deletable @delete="onDeleteVehicle" />
            </ClientOnly>
          </v-col>
        </v-row>
      </v-sheet>
      <v-sheet v-else class="d-flex flex-column pb-4 overflow-y-auto" width="100%" height="100%" color="transparent">
        <ClientOnly>
          <RoutesPreviewList class="mx-auto" cardTitle="Routes" :route-data="pRoutes || []" placeholder="Not involved in any routes" />
        </ClientOnly>
      </v-sheet>
      <v-bottom-navigation class="bottom-nav" v-model="selectedRole" grow color="cyan" bg-color="grey-darken-4" mandatory>
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
  import { useDisplay } from 'vuetify';
  const testVehicles = []
  for (let i = 0; i < 100; i++) {
    testVehicles.push({ name: 'Test' });
  }

  const { $api } = useNuxtApp();
  const preferredRole = usePreferredRole();
  const { mdAndUp } = useDisplay();

  const selectedRole = ref((!!preferredRole.value && preferredRole.value === 'passenger') ? 'passenger' : 'driver');
  const showError = ref(false);
  const errorText = ref('');
  const loading = ref(false);

  // Initial fetching
  const lazy = { lazy: true, server: false };

  // 'd' = driver, 'p' = passenger
  // Driver data
  const { data: dRoutes, status: dRoutesStatus, execute: executeFetchDRoutes } = await useApi('/api/routes', {
    ...lazy,
    immediate: (selectedRole.value === 'driver'),
  });
  const { data: dVehicles, status: dVehiclesStatus, execute: executeFetchDVehicles } = await useApi('/api/vehicles', {
    ...lazy,
    immediate: (selectedRole.value === 'driver'),
  });

  // Passenger data
  const { data: pRoutes, status: pRoutesStatus, execute: executeFetchPRoutes } = await useApi('/api/routes', {
    ...lazy,
    query: { passenger: true },
    immediate: (selectedRole.value === 'passenger'),
  });

  // Watch tab and trigger fetch if necessary
  watch(selectedRole, (role) => {
    preferredRole.value = role; // Save preferred role
    if (role === 'passenger' && pRoutesStatus.value === 'idle') {
      executeFetchPRoutes();
    } else if (role === 'driver') {
      if (dRoutesStatus.value === 'idle') executeFetchDRoutes();
      if (dVehiclesStatus.value === 'idle') executeFetchDVehicles();
    }
  });

  // Watch fetch statuses
  const fetchErrorText = 'Error fetching some data';
  watch([dRoutesStatus, dVehiclesStatus, pRoutesStatus], (statuses) => {
    loading.value = false;
    for (const status in statuses) {
      if (status === 'pending') loading.value = true;
      if (status === 'error') {
        errorText.value = fetchErrorText;
        showError.value = true;
      }
    }
  });

  // Delete handlers
  async function requestDelete(path, query, objectsRef, index, name) {
    loading.value = true;

    $api(path, {
      method: 'DELETE',
      query,
    })
    .then(() => {
      objectsRef.value.splice(index, 1);
    })
    .catch((error) => {
      switch (error.data?.statusCode) {
        default:
        errorText.value = `Unexpected Error deleting ${name}` + (error.data?.statusCode ? `: ${error.data.statusCode} ${error.data.statusText || ''}` : '');
        break;
      }
      showError.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
  }
  async function onDeleteRoute(index) {
    requestDelete('/api/routes', { routeID: dRoutes.value[index].routeID }, dRoutes, index, 'route');
  }
  async function onDeleteVehicle(index) {
    requestDelete('/api/vehicles', { vehicleID: dVehicles.value[index].vehicleID }, dVehicles, index, 'vehicle');
  }

  // Reactive style setup
  const cols = computed(() => mdAndUp.value ? 6 : 12);
</script>

<style scoped>
  .nav-text {
    font-size: 15px;
  }
  .bottom-nav {
    border-top: 2px solid grey;
  }
</style>

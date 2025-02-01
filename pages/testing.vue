<template>
  <NuxtLayout name="after-login">
    <v-sheet color="#333" width="100%" height="100%">
      <p>Hello, {{ userData?.user.username }} a.k.a. {{ userData?.user.userID }}! Your real name is {{ userData?.user.realName || 'unknown' }}!</p>
      <p class="font-weight-bold">Vehicles by userID:</p>
      <p>{{ vehicles }}</p>
      <p class="font-weight-bold">Vehicle by vehicleID:</p>
      <p>{{ singleVehicle }}</p>
      <v-btn @click="onPostClick()">Post</v-btn>
      <v-btn @click="onPatchClick()">Update</v-btn>
      <v-btn @click="onDeleteClick()">Delete</v-btn>
    </v-sheet>
  </NuxtLayout>
</template>

<script setup>
  const { $api } = useNuxtApp();

  // BUG: useApi request does not contain the token cookies during SSR
  const { data: userData } = await useApi('/api/users', { lazy: true, server: false });
  const { data: vehicles } = await useApi('/api/vehicles', { lazy: true, server: false });
  const { data: singleVehicle } = await useApi('/api/vehicles', { query: { vehicleID: '769be576-16a4-40a9-81c8-6ce16ed72767' }, lazy: true, server: false });
  let newVehicleID = null;

  async function onPostClick() {
    await $api('/api/vehicles', {
      method: 'POST',
      body: {
        name: 'My vehicle',
        consumption: 3.12,
        electric: false,
      }
    })
    .then(response => {
      if (!!response) newVehicleID = response.vehicleID;
    })
    .catch(err => {
      console.error(err);
    });
  }
  async function onPatchClick() {
    await $api('/api/vehicles', {
      method: 'PATCH',
      query: {vehicleID: newVehicleID},
      body: {
        name: 'My updated vehicle',
      }
    })
    .catch(err => {
      console.log(err.data);
    })
    .then(response => {
      console.log(response);
    });
  }
  async function onDeleteClick() {
    await $api('/api/vehicles', {
      method: 'DELETE',
      query: {vehicleID: newVehicleID},
    })
    .catch(err => {
      console.log(err.data);
    })
    .then(response => {
      console.log(response);
    });
  }
</script>

<style>

</style>

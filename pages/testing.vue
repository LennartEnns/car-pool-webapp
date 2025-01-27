<template>
  <NuxtLayout name="after-login">
    <p>Hello, {{ user.username }} a.k.a. {{ user.userID }}! Your real name is {{ user.realName || 'unknown' }}!</p>
    <p class="font-weight-bold">Vehicles by userID:</p>
    <p>{{ vehicles }}</p>
    <p class="font-weight-bold">Vehicle by vehicleID:</p>
    <p>{{ singleVehicle }}</p>
    <v-btn @click="onPostClick()">Post</v-btn>
    <v-btn @click="onPatchClick()">Update</v-btn>
    <v-btn @click="onDeleteClick()">Delete</v-btn>
  </NuxtLayout>
</template>

<script setup>
  let user = {};
  if (import.meta.client) {
    const userObj = localStorage.getItem('user');
    if (!!userObj) user = userObj;
  }

  const { data: vehicles } = useFetch('/api/vehicles', { query: { userID: user.userID } });
  const { data: singleVehicle } = useFetch('/api/vehicles', { query: { vehicleID: '769be576-16a4-40a9-81c8-6ce16ed72767' } });
  let newVehicleID = null;

  async function onPostClick() {
    await $fetch('/api/vehicles', {
      method: 'POST',
      body: {
        name: 'My vehicle',
        consumption: 3.12,
        electric: false,
      }
    })
    .catch(err => {
      console.log(err.data);
    })
    .then(response => {
      console.log(response);
      newVehicleID = response.vehicleID;
    });
  }
  async function onPatchClick() {
    $fetch('/api/vehicles', {
      method: 'PATCH',
      query: {vehicleID: newVehicleID},
      body: {
        name: 'My updated vehicle',
      }
    });
  }
  async function onDeleteClick() {
    $fetch('/api/vehicles', {
      method: 'DELETE',
      query: {vehicleID: newVehicleID},
    });
  }
</script>

<style>

</style>

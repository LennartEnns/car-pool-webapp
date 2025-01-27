<template>
  <NuxtLayout name="after-login">
    <v-sheet color="#333" width="100%" height="100%">
      <p>Hello, {{ userData.user.username }} a.k.a. {{ userID }}! Your real name is {{ userData.user.realName || 'unknown' }}!</p>
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
  const jwtCookie = useCookie('jwt');
  const { userID } = parseJwtPayload(jwtCookie.value);

  const { data: userData } = useFetch('/api/users', { query: { userID } });
  const { data: vehicles } = useFetch('/api/vehicles', { query: { userID } });
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
      if (!!response) newVehicleID = response.vehicleID;
    });
  }
  async function onPatchClick() {
    await $fetch('/api/vehicles', {
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
    await $fetch('/api/vehicles', {
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

<template>
  <NuxtLayout name="after-login">
    <p>Hello, {{ username }} a.k.a. {{ userID }}! Your real name is {{ realName || 'unknown' }}!</p>
    <p class=""></p>
    <p>{{ vehicles }}</p>
    <v-btn class="" @click="onPostClick()">Post</v-btn>
    <v-btn @click="onPatchClick()">Update</v-btn>
    <v-btn @click="onDeleteClick()">Delete</v-btn>
  </NuxtLayout>
</template>

<script setup>
  const jwtCookie = useCookie('jwt');
  const { userID, username, name: realName } = parseJwtPayload(jwtCookie.value);

  const { data: vehicles } = useFetch('/api/vehicles', { query: { userID } });
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

<template>
  <div>
    <p>Hello, {{ username }} a.k.a. {{ userID }}! Your real name is {{ realName || 'unknown' }}!</p>
    <p class=""></p>
    <p>{{ vehicles }}</p>
    <v-btn class="" @click="onPostClick()">Post</v-btn>
    <v-btn @click="onPatchClick()">Update</v-btn>
    <v-btn @click="onDeleteClick()">Delete</v-btn>
  </div>
</template>

<script setup>
  const jwtCookie = useCookie('jwt');
  const { userID, username, name: realName } = parseJwtPayload(jwtCookie.value);

  const { data: vehicles } = useFetch('/api/vehicles', { query: { userID } });

  function onPostClick() {
    fetchWithJSONBody('/api/vehicles', 'POST', {
      vehicleID: '51e21343-8aef-4c68-b4cb-16f10019050f',
      name: 'My vehicle',
      consumption: 3.12,
      electric: false,
    });
  }
  function onPatchClick() {
    const vehicleID = '51e21343-8aef-4c68-b4cb-16f10019050f';
    fetchWithJSONBody('/api/vehicles?' + new URLSearchParams({vehicleID}).toString(), 'PATCH', {
      name: 'My updated vehicle',
    });
  }
  function onDeleteClick() {
    const vehicleID = '51e21343-8aef-4c68-b4cb-16f10019050f';
    fetch('/api/vehicles?' + new URLSearchParams({vehicleID}).toString(), {method: 'DELETE'});
  }
</script>

<style>

</style>

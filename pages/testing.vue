<template>
  <div>
    <p>Hello, {{ username }}! Your real name is {{ realName || 'unknown' }}!</p>
    <p>{{ vehicles.vehicles }}</p>
    <v-btn @click="onPostClick()">Post</v-btn>
    <v-btn @click="onPatchClick()">Update</v-btn>
  </div>
</template>

<script setup>
  const jwtCookie = useCookie('jwt');
  const { userID, username, name: realName } = parseJwtPayload(jwtCookie.value);
  const { data: vehicles } = useFetch('/api/vehicles', {query: { userID }});

  function onPostClick() {
    fetchWithJSONBody('/api/vehicles', 'POST', {
        vehicleID: 'f2691f3f-4987-41c1-935c-fc5d7d326d3e',
        name: 'My vehicle',
        consumption: 3.12,
        electric: false,
    });
  }
  function onPatchClick() {
    const vehicleID = 'f2691f3f-4987-41c1-935c-fc5d7d326d3e';
    fetchWithJSONBody('/api/vehicles?' + new URLSearchParams({vehicleID}).toString(), 'PATCH', {
        name: 'My updated vehicle',
    });
  }
</script>

<style>

</style>

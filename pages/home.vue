<template>
  <div>
    <p>Hello, {{ username }}! Your real name is {{ realName || 'unknown' }}!</p>
    <p>{{ vehicles }}</p>
  </div>
</template>

<script setup>
  const jwtCookie = useCookie('jwt');
  const { username, name: realName } = parseJwtPayload(jwtCookie.value);
  const { data: vehicles } = useFetch('/api/vehicles');
</script>

<style>

</style>
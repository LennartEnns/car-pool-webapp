<template>
  <div>
    <p>Hello, {{ username }}! Your real name is {{ realName || 'unknown' }}!</p>
  </div>
</template>

<script setup>
  const jwtCookie = useCookie('jwt');
  const { username, name: realName } = parseJwtPayload(jwtCookie.value);
</script>

<style>

</style>
<template>
  <div>
    <p v-for = '(user, index) in users' :key='index'>{{ user.username }}</p>
  </div>
</template>

<script setup>
  // Test setup
  const users = ref([]);
  const { data } = await useFetch('/api/users');
  if (data.value.success) {
    users.value = data.value.data.users;
    console.log(users.value);
  }
</script>

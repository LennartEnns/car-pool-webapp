<template>
  <v-app-bar color="primary">
    <v-icon icon="mdi-home" class="icon ml-2 mr-2" @click="returnHome" />
    <v-app-bar-title class="flex text-center font-weight-bold mx-auto">Car Pool Cost Distributor</v-app-bar-title>
    <v-btn icon>
      <v-icon class="icon">mdi-account</v-icon>
      <v-menu activator="parent">
        <v-list>
          <v-list-item prepend-icon="mdi-account-settings" @click="onAccountSettings">
            <v-list-item-title>Account Settings</v-list-item-title>
          </v-list-item>
          <v-list-item color="red" prepend-icon="mdi-logout" @click="onLogout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-app-bar>
  <v-main width="100%" height="100%">
    <slot />
  </v-main>
</template>

<script setup>
  const session = useUserSession();
  const authenticated = useCookie('authenticated');

  onMounted(() => {
    // Log out if no session data is present 
    if (import.meta.client && !useUserSession().value) {
      authenticated.value = undefined;
      clearNuxtData();
      navigateTo('/login');
    }
  });

  const onAccountSettings = async () => {
    await navigateTo('/account');
  };
  const onLogout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' }) // Trigger deletion of the access token
      .catch(() => {}); // Ignore errors
    await $fetch('/api/auth/refresh', { method: 'DELETE' }) // Trigger deletion of the refresh token
      .catch(() => {}); // Ignore errors
    
    // Delete session data
    session.value = null;
    authenticated.value = undefined;
    clearNuxtData();

    await navigateTo('/login');
  };
  const returnHome = async () => {
    await navigateTo('/home');
  };

  onMounted(() => {
    if (import.meta.client && window) {
      window.history.scrollRestoration = 'manual';
    }
  });
</script>

<style scoped>
  .icon {
    font-size: 35px;
  }
</style>

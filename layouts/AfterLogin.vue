<template>
  <v-app-bar color="primary">
    <v-app-bar-nav-icon icon="mdi-home" size="x-large" @click="returnHome" />
    <v-app-bar-title class="flex text-center font-weight-bold"><b>C</b>ar <b>P</b>ool <b>C</b>ost <b>D</b>istributor</v-app-bar-title>
    <v-btn size="x-large" icon>
      <v-icon size="large">mdi-account</v-icon>
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
  onMounted(() => {
    // Log out if no session data is present 
    if (import.meta.client && !useUserSession().value) {
      useCookie('authenticated').value = undefined;
      navigateTo('/login');
    }
  });

  const session = useUserSession();
  const authenticated = useCookie('authenticated');

  const onAccountSettings = async () => {
    await navigateTo('/account');
  };
  const onLogout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' }) // Trigger deletion of the token cookies
      .catch((err) => {}); // Ignore logout errors
    
    // Delete session data
    session.value = null;
    authenticated.value = undefined;

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

<style>
  
</style>
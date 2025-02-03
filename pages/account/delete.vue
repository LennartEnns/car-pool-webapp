<template>
  <NuxtLayout name="after-login">
    <v-sheet class="d-flex flex-column align-center justify-center" color="#333" width="100%" height="100%">
      <v-card class="border-card mt-8 rounded-xl" width="400px" max-width="90%" variant="elevated">
          <v-card-title class="text-center text-h5 font-weight-bold">
            <span class="headline">Delete Account</span>
          </v-card-title>
          <v-divider class="mx-3"/>
          <v-card-text>
            <v-form @submit.prevent="submit" v-model="formValid" validate-on="submit lazy">
              <v-text-field v-model="password" label="Password" type="password" :rules="[rules.required]"></v-text-field>
              <v-btn type="submit" color="error" :loading="loading">
                Delete
                <v-icon icon="mdi-delete-forever" end></v-icon>
              </v-btn>
            </v-form>
          </v-card-text>
          <v-snackbar v-model="showError" color="error" location="top" vertical timeout="4000">
            <div class="text-h6">Error</div>
            <p>{{ errorText }}</p>
          </v-snackbar>
        </v-card>
    </v-sheet>
  </NuxtLayout>
</template>

<script setup>
  const { $api } = useNuxtApp();

  const session = useUserSession();
  const authenticated = useCookie('authenticated');

  const formValid = ref(false);
  const password = ref('');
  const loading = ref(false);
  const showError = ref(false);
  const errorText = ref('');
  const rules = {
    required: value => !!value || 'Value required',
  };

  async function submit(event) {
    await event;

    if (formValid.value) {	
      requestDeletion();
    }
  }

  async function requestDeletion() {
    loading.value = true;

    const headers = {
      'Authorization': password.value,
    };

    // Request user deletion
    await $api('/api/users', {
      method: 'DELETE',
      headers,
    })
    .then(async () => {
      // Log out
      await $fetch('/api/auth/logout', { method: 'POST' }) // Trigger deletion of the access token
        .catch(() => {}); // Ignore errors
      await $fetch('/api/auth/refresh', { method: 'DELETE' }) // Trigger deletion of the refresh token
        .catch(() => {}); // Ignore errors

      // Delete session data
      session.value = null;
      authenticated.value = undefined;

      await navigateTo('/login');
    })
    .catch((error) => {
      switch (error.data?.statusCode) {
        case 403:
          errorText.value = 'Wrong password';
          break;
        default:
          console.log(error);
          errorText.value = 'Unexpected Error' + (error.data?.statusCode ? `: ${error.data.statusCode} ${error.data.statusText || ''}` : '');
          break;
      }
      showError.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
  }

</script>

<style>

</style>

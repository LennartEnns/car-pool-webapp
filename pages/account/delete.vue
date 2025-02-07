<template>
  <NuxtLayout name="after-login">
    <v-sheet class="d-flex flex-column align-center justify-center" color="#333" width="100%" height="100%">
      <DefaultCard class="mt-8 rounded-xl" card-title="Delete Account">
          <v-card-text>
            <v-form @submit.prevent="submit" v-model="formValid">
              <v-text-field v-model="password" label="Password" type="password" :rules="[rules.required]"></v-text-field>
              <v-btn type="submit" color="error" :loading="loading" :disabled="!formValid">
                Delete
                <v-icon icon="mdi-delete-forever" end></v-icon>
              </v-btn>
            </v-form>
          </v-card-text>
          <v-snackbar v-model="showError" color="error" location="top" vertical timeout="4000">
            <div class="text-h6">Error</div>
            <p>{{ errorText }}</p>
          </v-snackbar>
      </DefaultCard>
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
      clearNuxtData();

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

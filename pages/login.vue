<template>
  <v-main width="100%" height="100%">
      <v-sheet class="d-flex flex-column align-center justify-center" height="100%" width="100%">
          <v-card class="mt-10" width="400" max-width="90%" variant="elevated">
              <v-card-title class="text-center text-h5">
                  <span class="headline">Anmeldung</span>
              </v-card-title>
              <v-divider class="mx-3"/>
              <v-card-text>
                  <v-form @submit.prevent="submit" v-model="formValid" validate-on="submit lazy">
                      <v-text-field v-model="username" label="Benutzername" type="text" :rules="[rules.required]"></v-text-field>
                      <v-text-field v-model="password" label="Passwort" type="password" :rules="[rules.required]"></v-text-field>
                      <v-btn type="submit" color="success" :loading="loading">
                          Anmelden
                          <v-icon icon="mdi-login" end></v-icon>
                      </v-btn>
                  </v-form>
              </v-card-text>
              <v-snackbar v-model="showError" color="error" location="top" vertical timeout="4000">
                  <div class="text-h6">Fehler</div>
                  <p>{{ errorText }}</p>
              </v-snackbar>
          </v-card>
      </v-sheet>
  </v-main>
</template>

<script setup>
  const formValid = ref(false);
  const username = ref('');
  const password = ref('');
  const loading = ref(false);
  const showError = ref(false);
  const errorText = ref('');
  const rules = {
    required: value => !!value || 'Eingabe erforderlich.',
  };

  const runtimeConfig = useRuntimeConfig();

  // Cookies for JWT token and user role
  const jwtCookie = useCookie('jwt', {
      // Set to secure if env var 'SECURE_COOKIES' is true
      secure: runtimeConfig.public.secureCookies,
  });

  async function submit(event) {
      await event;

      if (formValid.value) {	
          requestLogin();
      }
  }

  async function saveJwtCookie(jwtToken) {
      // Save JWT token in cookie
      jwtCookie.value = jwtToken
  }

  async function requestLogin() {
      loading.value = true;

      // Set headers for POST request
      const headers = {
          'Authorization': encodeBasicAuth(username.value, password.value),
      };

      // Fetch JWT token from API
      fetch('/api/authenticate', {
          method: 'get',
          headers,
      })
      .then((response) => {
          switch (response.status) {
              case 200:
                  // Read the ReadableStream to get the response body
                  response.json().then((data) => {
                      // Extract JWT token from response
                      const jwtToken = data.token;

                      // Save JWT token in cookie
                      saveJwtCookie(jwtToken);

                      // Navigate to homepage
                      navigateTo('/home');
                  });
                  break;
              case 401:
                  errorText.value = 'Benutzername oder Passwort falsch';
                  showError.value = true;
                  break;
              default:
                  errorText.value = `Unerwarteter Fehler: ${response.status} ${response.statusText}`;
                  showError.value = true;
                  break;
          }
      })
      .catch((error) => {
          // console.error('Error fetching /authenticate: ', JSON.stringify(error));
          errorText.value = 'Unerwarteter Fehler';
          showError.value = true;
      })
      .finally(() => {
          loading.value = false;
      });
  }
</script>

<style scoped>
  
</style>
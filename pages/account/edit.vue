<template>
  <NuxtLayout name="after-login">
    <v-sheet class="d-flex flex-column align-center justify-center" color="#333" width="100%" height="100%">
      <DefaultCard class="mt-8 rounded-xl" card-title="Edit Account">
          <v-card-text>
            <v-form @submit.prevent="submit" v-model="formValid" validate-on="submit lazy">
              <ClientOnly>
                <v-text-field v-model="oldPassword" label="Current password" type="password" :rules="[rules.required]"></v-text-field>
                <v-text-field v-model="username" label="Username" type="text" :rules="[rules.requiredNotBlank, rules.validUsername]" :maxlength="userLimits.username"></v-text-field>
                <v-text-field v-model="realName" label="Real name (optional)" type="text" :rules="[rules.validRealName]" :maxlength="userLimits.realName"></v-text-field>
                <v-text-field v-model="newPassword" label="New password (optional)" type="password"></v-text-field>
                <v-text-field v-model="confirmNewPassword" label="Confirm new password" type="password" :rules="[rules.matchPassword]"></v-text-field>
                <v-btn :disabled="!different" type="submit" color="error" :loading="loading">
                  Update
                  <v-icon icon="mdi-account-sync" end></v-icon>
                </v-btn>
              </ClientOnly>
            </v-form>
          </v-card-text>
      </DefaultCard>
      <v-snackbar v-model="showError" color="error" location="top" vertical timeout="4000">
        <div class="text-h6">Error</div>
        <p>{{ errorText }}</p>
      </v-snackbar>
      <v-snackbar v-model="showSuccess" color="success" location="top" vertical timeout="4000">
        <div class="text-h6">Update successful</div>
      </v-snackbar>
    </v-sheet>
  </NuxtLayout>
</template>

<script setup>
  import { validateUsername, validateRealNameBeforeTitleCase } from '~/commonRules';
  import { userLimits } from '~/commonLimits';
  import DefaultCard from '~/components/DefaultCard.vue';

  const { $api } = useNuxtApp();
  const userData = useUserSession();

  const oldPassword = ref('');
  const username = ref(userData.value?.username);
  const realName = ref(userData.value?.realName || '');
  const newPassword = ref('');
  const confirmNewPassword = ref('');

  const changedData = computed(() => removeUndefinedEntries({
    username: username.value !== userData.value?.username ? (username.value || undefined) : undefined,
    realName: realName.value !== userData.value?.realName ? (realName.value || null) : undefined,
    password: newPassword.value.length > 0 ? newPassword.value : undefined,
  }));
  const different = computed(() => Object.keys(changedData.value).length > 0);

  const formValid = ref(false);
  const loading = ref(false);
  const showError = ref(false);
  const showSuccess = ref(false);
  const errorText = ref('');
  const rules = {
    required: value => !!value || 'Value required',
    requiredNotBlank: value => (!!value && value.trim().length > 0) || 'Value required',
    matchPassword: value => value === newPassword.value || 'Passwords don\'t match',
    validUsername: value => validateUsername(value) || 'Must use a letter followed by letters/numbers/underscores',
    validRealName: value => (!value || validateRealNameBeforeTitleCase(value)) || 'Must use letters separated by spaces/hyphens',
  };

  async function submit(event) {
    await event;

    if (formValid.value) {	
      requestUpdate();
    }
  }

  async function requestUpdate() {
    loading.value = true;

    const headers = {
      'Authorization': oldPassword.value,
    };

    // Request user update
    await $api('/api/users', {
      method: 'PATCH',
      headers,
      body: changedData.value,
    })
    .then((response) => {
      if (!!response.newUser && !!response.newUser.username) {
        userData.value.username = response.newUser.username;
        userData.value.realName = response.newUser.realName;
      }
      showSuccess.value = true;
      setTimeout(() => navigateTo('/home'), 1000);
    })
    .catch((error) => {
      switch (error.data?.statusCode) {
        case 403:
          errorText.value = 'Wrong password';
          break;
        case 409:
          errorText.value = 'Username already taken';
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

<template>
  <NuxtLayout name="after-login">
    <v-sheet class="d-flex flex-column align-center justify-center overflow-x-hidden" color="#333" width="100%" height="100%">
      <ClientOnly>
        <div class="greeting">
          Hello, {{ userData?.realName || userData?.username }}!
        </div>
        <div class="subgreeting" v-if="!!userData?.realName">Username: {{ userData?.username }}</div>
      </ClientOnly>
      <div width="500px">
        <div class="big-button mt-10" @click="navigateTo('/account/edit')">
          <v-icon icon="mdi-account-edit-outline" start></v-icon>
          Edit Account
          <div class="flex-grow-1"></div>
          <v-icon icon="mdi-arrow-right-thin" color="grey" end></v-icon>
        </div>
        <div class="big-button delete-button mt-5" @click="navigateTo('/account/delete')">
          <v-icon icon="mdi-account-cancel-outline" start></v-icon>
          Delete Account
          <div class="flex-grow-1"></div>
          <v-icon icon="mdi-arrow-right-thin" color="grey" end></v-icon>
        </div>
      </div>
    </v-sheet>
  </NuxtLayout>
</template>

<script lang="ts" setup>
  const userData = useUserSession();
</script>

<style scoped>
  .greeting {
    font-size: 3rem;
    font-weight: bold;
    text-align: center;
    text-wrap: wrap;
    overflow-wrap: anywhere;
  }
  .subgreeting {
    font-size: 2rem;
    font-weight: bold;
    color: gray;
    text-align: center;
  }
  .big-button {
    cursor: pointer;
    user-select: none;
  }
  .delete-button {
    border-color: red;
  }
  .delete-button:hover {
    background-color: #550000;
  }
</style>

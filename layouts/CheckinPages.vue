<template>
  <v-main width="100%" height="100%">
		<v-sheet class="d-flex flex-column align-center justify-center" color="#333" width="100%" height="100%">
			<div class="app-title font-weight-black d-flex align-center mb-4" max-width="90%">
        <v-icon icon="mdi-car" class="mr-3"></v-icon>
        CPCD
        <v-icon icon="mdi-cash-sync" class="ml-3"></v-icon>
      </div>
      <v-divider color="black" opacity="70%" width="400px" maxWidth="95%" />
			<slot />
		</v-sheet>
	</v-main>
</template>

<style scoped>
  .app-title {
    font-size: 50px;
  }
</style>

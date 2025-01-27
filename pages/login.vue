<template>
	<NuxtLayout name="checkin-pages">
        <v-card class="mt-8" width="400px" max-width="90%" variant="elevated">
            <v-card-title class="text-center text-h5 font-weight-bold">
                <span class="headline">Sign in</span>
            </v-card-title>
            <v-divider class="mx-3"/>
            <v-card-text>
                <v-form @submit.prevent="submit" v-model="formValid" validate-on="submit lazy">
                    <v-text-field v-model="username" label="Username" type="text" :rules="[rules.requiredNotBlank, rules.validUsername]" :maxLength="userLimits.username"></v-text-field>
                    <v-text-field v-model="password" label="Password" type="password" :rules="[rules.required]"></v-text-field>
                    <div class="d-flex align-center">
                        <v-btn type="submit" color="success" :loading="loading">
                            Login
                            <v-icon icon="mdi-login" end></v-icon>
                        </v-btn>
                        <div class="ml-3 text-grey-darken-2 flex-grow-1 d-flex justify-center bg-grey-lighten-4" style="border-radius: 10px">
                            No account?
                            <a href="/signup" class="ml-1">Register now</a>
                        </div>
                    </div>
                </v-form>
            </v-card-text>
            <v-snackbar v-model="showError" color="error" location="top" vertical timeout="4000">
                <div class="text-h6">Error</div>
                <p>{{ errorText }}</p>
            </v-snackbar>
        </v-card>
	</NuxtLayout>
</template>

<script setup lang="ts">
    import { validateUsername } from '~/commonRules';
    import { userLimits } from '~/commonLimits';

    const formValid = ref(false);
    const username = ref('');
    const password = ref('');
    const loading = ref(false);
    const showError = ref(false);
    const errorText = ref('');
    const rules = {
        required: (value: any) => !!value || 'Value required',
        requiredNotBlank: (value: any) => (!!value && value.trim().length > 0) || 'Value required',
        validUsername: (value: any) => validateUsername(value) || 'Must use a letter followed by letters/numbers/underscores',
    };

    const runtimeConfig = useRuntimeConfig();

    // Cookies for JWT token and user role
    const jwtCookie = useCookie('jwt', {
        // Set to secure if env var 'SECURE_COOKIES' is true
        secure: runtimeConfig.public.secureCookies,
    });

    async function submit(event: any) {
        await event;

        if (formValid.value) {	
            requestLogin();
        }
    }

    async function requestLogin() {
        loading.value = true;

        // Set headers for POST request
        const headers = {
            'Authorization': encodeBasicAuth(username.value.trim(), password.value),
        };

        // Fetch JWT token from API
        $fetch('/api/authenticate', {
            method: 'get',
            headers,
        })
        .then((response) => {
            // Save JWT token in cookie
            jwtCookie.value = response.token;

            // Navigate to homepage
            navigateTo('/home');
        })
        .catch((error) => {
            switch (error.data?.statusCode) {
                case 401:
                    errorText.value = 'Wrong username or password';
                    showError.value = true;
                    break;
                default:
                errorText.value = 'Unexpected Error' + (error.data?.statusCode ? `: ${error.data.statusCode} ${error.data.statusText || ''}` : '');
                    showError.value = true;
                    break;
            }
        })
        .finally(() => {
            loading.value = false;
        });
    }
</script>

<style scoped>
    
</style>

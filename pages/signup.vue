<template>
	<NuxtLayout name="checkin-pages">
        <v-card class="border-card mt-8 rounded-xl" width="400px" max-width="90%" variant="elevated">
            <v-card-title class="text-center text-h5 font-weight-bold">
                <span class="headline">Registration</span>
            </v-card-title>
            <v-divider class="mx-3"/>
            <v-card-text>
                <v-form @submit.prevent="submit" v-model="formValid" validate-on="submit lazy">
                    <v-text-field v-model="regKey" label="Registration Key" type="password" :rules="[rules.required]"></v-text-field>
                    <v-text-field v-model="username" label="Username" type="text" :rules="[rules.requiredNotBlank, rules.validUsername]" :maxlength="userLimits.username"></v-text-field>
                    <v-text-field v-model="realName" label="Real name (optional)" type="text" :rules="[rules.validRealName]" :maxlength="userLimits.realName"></v-text-field>
                    <v-text-field v-model="password" label="Password" type="password" :rules="[rules.required]"></v-text-field>
                    <v-text-field v-model="confirmPassword" label="Confirm password" type="password" :rules="[rules.required, rules.matchPassword]"></v-text-field>
                    <v-btn type="submit" color="success" :loading="loading">
                        Register
                        <v-icon icon="mdi-account-plus" end></v-icon>
                    </v-btn>
                </v-form>
            </v-card-text>
            <v-snackbar v-model="showError" color="error" location="top" vertical timeout="4000">
                <div class="text-h6">Error</div>
                <p>{{ errorText }}</p>
            </v-snackbar>
        </v-card>
	</NuxtLayout>
</template>

<script setup>
    import { validateUsername, validateRealNameBeforeTitleCase } from '~/commonRules';
    import { userLimits } from '~/commonLimits';

    const session = useUserSession();
    const authenticated = useCookie('authenticated');

    const formValid = ref(false);

    const regKey = ref('');
    const username = ref('');
    const realName = ref('');
    const password = ref('');
    const confirmPassword = ref('');

    const loading = ref(false);
    const showError = ref(false);
    const errorText = ref('');
    const rules = {
        required: value => !!value || 'Value required',
        requiredNotBlank: value => (!!value && value.trim().length > 0) || 'Value required',
        matchPassword: value => value === password.value || 'Passwords don\'t match',
        validUsername: value => validateUsername(value) || 'Must use a letter followed by letters/numbers/underscores',
        validRealName: value => (!value || validateRealNameBeforeTitleCase(value)) || 'Must use letters separated by spaces/hyphens',
    };

    async function submit(event) {
        await event;

        if (formValid.value) {	
            requestSignup();
        }
    }

    async function requestSignup() {
        loading.value = true;

        // Set headers for POST request
        const headers = {
            'Authorization': regKey.value,
        };

        // Fetch JWT token from API
        $fetch('/api/users', {
            method: 'post',
            headers,
            body: removeUndefinedEntries({
                username: username.value,
                realName: (!!realName.value ? (realName.value.length > 0 ? realName.value : undefined) : undefined),
                password: password.value,
            })
        })
        .then((response) => {
            // Update session state
            session.value = response.user;
            authenticated.value = '1';

            // Navigate to homepage
            navigateTo('/home');
        })
        .catch((error) => {
            switch (error.data?.statusCode) {
                case 401:
                    errorText.value = 'Wrong registration key. Ask the admin.';
                    break;
                default:
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

<style scoped>

</style>

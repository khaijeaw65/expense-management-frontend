<template>
  <v-app>
    <drawer />
    <v-main class="h-100">
      <v-container fluid class="h-100">
        <user-menu />
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
html,
body {
  height: 100vh;
}
</style>

<script setup lang="ts">
import { type User } from '~/types/user.model';
import { useUser } from '~/composables/user';

const token = localStorage.getItem('token');

const refreshProfile = async () => {
  try {
    if (token) {
      const { data: response } = await useLazyFetch<{ result: { user: User, token: string } }>('http://localhost:8000/auth/profile', {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      watch(response, (newData) => {
        localStorage.setItem('token', newData?.result.token!)
        useUser().value = newData?.result.user!;
      })
      return;
    }
    useRouter().replace('/login');
  } catch (error) {
    useRouter().replace('/login');
  }
}

await refreshProfile()

</script>
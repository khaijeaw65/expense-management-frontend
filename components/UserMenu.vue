<template>
  <div>
    <v-row justify="end">
      <v-col cols="auto">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-account" size="default" v-bind="props"></v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>ข้อมูลส่วนตัว</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>ออกจากระบบ</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '~/composables/user';
const logout = () => {
  localStorage.removeItem('token');
  useUser().value = {
    id: 0,
    firstName: '',
    lastName: '',
    username: '',
  };
  useRouter().replace('/login');
}
</script>
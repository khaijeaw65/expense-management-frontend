<template>
  <div class="center-container">
    <v-card class="login-box-wrapper">
      <v-row>
        <v-col cols="12" md="6" class="h-100 bg-deep-purple-darken-1 d-flex flex-column align-center justify-center">
          <div>
            <v-card-title>Expense Management</v-card-title>
            <v-img :width="220" src="~/assets/images/spending.png"></v-img>
          </div>
        </v-col>
        <v-col cols="12" md="6" class="h-100 d-flex flex-column justify-center align-center bg-grey-darken-3 w-100">
          <v-form @submit="onSubmit" style="width: 80%">
            <v-text-field v-bind="username" variant="outlined" label="username" class="pb-2"/>
            <v-text-field v-bind="password" variant="outlined" label="password" type="password" class="pb-2" />
            <div class="d-flex justify-center pt-2">
              <v-btn color="#7E57C2" type="submit">login</v-btn>
            </div>
          </v-form>
          <p class="pt-2">Doesn't have an account? <NuxtLink to="/register" id="register-btn">register</NuxtLink>
          </p>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
import { useUser } from '~/composables/user';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { type User } from '../types/user.model'

definePageMeta({
  layout: false,
})

const schema = yup.object({
  username: yup.string().required().label('username'),
  password: yup.string().min(8).required(),
});

const { defineComponentBinds, handleSubmit } = useForm({
  validationSchema: schema,
});

const vuetifyConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const username = defineComponentBinds('username', vuetifyConfig);
const password = defineComponentBinds('password', vuetifyConfig);

const onSubmit = handleSubmit(async (values) => {
  try {
    const { data, error } = await useFetch<{ result: { user: User, token: string } }>('http://localhost:8000/auth/login', {
      method: 'post',
      body: {
        username: values.username,
        password: values.password,
      }
    })

    if (error.value) {
      console.log(error.value.data);
      if (error.value.data.cause === 'invalid credentials') {
        await Swal.fire({
          icon: 'error',
          html: '<p class="text-white">username หรือ password ไม่ถูกต้อง</p>',
          background: '#424242',
          iconColor: '#7E57C2',
          showConfirmButton: false,
        })
      }
      return;
    }
    localStorage.setItem('token', data.value?.result.token!)
    useUser().value = data?.value?.result.user!;
    useRouter().push('/')
  } catch (error) {
    console.log(error);
    Swal.fire('error')
  }
});
</script>

<style scoped>
.center-container {
  display: grid;
  place-items: center;
  height: 100vh;
}

.login-box-wrapper {
  display: flex;
  width: 50vh;
  height: 50vh;
}

#register-btn {
  text-decoration: none;
  color: #B388FF;
}
</style>
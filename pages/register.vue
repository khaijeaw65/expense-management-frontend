

<template>
  <div class="center-container">
    <v-card class="login-box-wrapper">
      <v-row>
        <v-col cols="12" md="6" class="h-100 bg-deep-purple-darken-1 d-flex flex-column align-center justify-center">
          <div>
            <v-card-title>Expense Management Register</v-card-title>
            <v-img :width="220" src="~/assets/images/spending.png"></v-img>
          </div>
        </v-col>
        <v-col cols="12" md="6" class="h-100 d-flex justify-center align-center bg-grey-darken-3 w-100">
          <v-form @submit="onSubmit" class="d-flex flex-column justify-center align-center" style="width: 80%">
            <v-text-field v-bind="username" variant="outlined" label="username" style="width: 80%" class="pb-2"/>
            <v-text-field v-bind="password" variant="outlined" label="password" type="password" style="width: 80%" class="pb-2"/>
            <v-text-field v-bind="firstName" variant="outlined" label="ชื่อ" style="width: 80%" class="pb-2"/>
            <v-text-field v-bind="lastName" variant="outlined" label="นามสกุล" style="width: 80%" class="pb-2"/>
            <v-btn color="#7E57C2" type="submit">register</v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { type User } from '~/types/user.model';

definePageMeta({
  layout: false,
})

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().min(8).required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
});

const { defineComponentBinds, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const vuetifyConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const username = defineComponentBinds('username', vuetifyConfig);
const password = defineComponentBinds('password', vuetifyConfig);
const firstName = defineComponentBinds('firstName', vuetifyConfig);
const lastName = defineComponentBinds('lastName', vuetifyConfig);


const onSubmit = handleSubmit(async (values) => {
  const { data, error } = await useFetch<{ result: { user: User, token: string } }>('http://localhost:8000/auth/register', {
    method: 'post',
    body: {
      username: values.username,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
    },
  });
  const err = error.value
  if (err) {
    if (err.data.cause === 'duplicate user') {
      await Swal.fire({
          icon: 'error',
          html: '<p class="text-white">ชื่อผู้ใช้งานซ้ำกับในระบบ</p>',
          background: '#424242',
          iconColor: '#7E57C2',
          showConfirmButton: false,
        })
      return;
    }
  }
  localStorage.setItem('token', data.value?.result.token!)
  useUser().value = data?.value?.result.user!;
  useRouter().push('/')
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
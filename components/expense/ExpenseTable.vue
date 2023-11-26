
import type { VCardItem } from 'vuetify/lib/components/index.mjs';
<template>
  <div>
    <v-card class="bg-grey-darken-3 h-100">
      <v-card-title>รายจ่าย</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="11" sm="6" class="pl-0">
            <v-text-field v-model="searchText" variant="outlined" label="ค้นหาด้วยรายละเอียด" />
          </v-col>
          <v-col cols="1">
            <v-dialog v-model="dialogState" width="500">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-plus" color="#7E57C2" size="small" class="mt-2"></v-btn>
              </template>

              <v-card>
                <v-toolbar color="#7E57C2" title="เพิ่มรายจ่าย"></v-toolbar>
                <v-form @submit="onSubmit">
                  <v-card-text>
                    <v-col cols="12">
                      <v-text-field v-bind="detail" variant="outlined" label="รายละเอียด" />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-bind="amount" variant="outlined" label="ยอดเงิน" />
                    </v-col>
                    <v-col>
                      <v-menu v-model="menuState" :close-on-content-click="false">
                        <template v-slot:activator="{ props }">
                          <v-text-field variant="outlined" label="วันที่" :model-value="formatDate" readonly
                            v-bind="props"></v-text-field>
                        </template>
                        <v-date-picker v-model="selectedDate"></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-card-text>
                  <v-card-actions>

                    <v-spacer></v-spacer>
                    <v-btn class="bg-deep-purple-lighten-1 text-white" type="submit">บันทึก</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>

          </v-col>
        </v-row>

        <v-data-table :loading="tableLoaded" :search="searchText" :headers="tableHeaders" :items="tableData"
          no-data-text="ไม่พบข้อมูลรายจ่าย" loading-text="โหลดข้อมูลรายจ่าย">
          <template #[`item.action`]="{ item }">
            <v-row>
              <v-btn icon="mdi-trash-can" color="#7E57C2" size="x-small"
                @click="deleteExpense((item as Expense).id)"></v-btn>
            </v-row>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { type Expense } from '../../types/expense.model'

const searchText = ref('')

const tableData = ref();

const tableLoaded = ref(true)

const tableHeaders = [
  { title: 'วันที่', value: 'date' },
  { title: 'ลายละเอียด', value: 'detail' },
  { title: 'ยอดเงิน', value: 'amount' },
  { value: 'action' }
];

const fetchData = async () => {
  const { data: response } = await useFetch<{ result: Expense[] }>('http://localhost:8000/expenses/getUserExpense', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    immediate: true
  })
  tableData.value = response.value?.result.map((item) => {
    const copy = { ...item };
    copy.date = new Date(copy.date).toLocaleDateString('sv-SE')
    return copy
  })
  tableLoaded.value = false
}

onMounted(async () => {
  await fetchData();
})

const selectedDate = ref(new Date())

const dialogState = ref(false);

const menuState = ref(false)

const formatDate = computed(() => (new Date(selectedDate.value).toLocaleDateString('sv-SE')))

import Swal from 'sweetalert2'
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const schema = yup.object({
  detail: yup.string().required(),
  amount: yup.number().required().typeError('amount must be number only'),
});

const { defineComponentBinds, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const vuetifyConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const detail = defineComponentBinds('detail', vuetifyConfig);
const amount = defineComponentBinds('amount', vuetifyConfig);

const onSubmit = handleSubmit(async (values) => {
  const { data, error } = await useFetch('http://localhost:8000/expenses/addExpense', {
    method: 'post',
    body: {
      detail: values.detail,
      amount: values.amount,
      date: selectedDate.value.toLocaleDateString('sv-SE'),
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (error.value) {
    dialogState.value = false;
    await Swal.fire({
      icon: 'error',
      html: '<p class="text-white">เกิดข้อผิดพลาด</p>',
      background: '#424242',
      iconColor: '#7E57C2',
      showConfirmButton: false,
    })
    dialogState.value = true;
    return;
  }

  dialogState.value = false;
  await Swal.fire({
    icon: 'success',
    html: '<p class="text-white">บันทึกข้อมูลเรียบร้อย</p>',
    background: '#424242',
    iconColor: '#7E57C2',
    showConfirmButton: false,
  })
  await fetchData()
})

const deleteExpense = async (expenseId: number) => {
  const { isConfirmed } = await Swal.fire({
    icon: 'question',
    html: '<p class="text-white">ยืนยันการลบข้อมูลรายจ่ายใช่หรือไม่</p>',
    background: '#424242',
    iconColor: '#7E57C2',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก'
  })

  if (isConfirmed) {
    const { data, error } = await useFetch('http://localhost:8000/expenses/deleteExpense', {
      method: 'post',
      body: {
        expenseId,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (error.value) {
      await Swal.fire({
        icon: 'error',
        html: '<p class="text-white">เกิดข้อผิดพลาด</p>',
        background: '#424242',
        iconColor: '#7E57C2',
        showConfirmButton: false,
      })
      return;
    }

    await Swal.fire({
      icon: 'success',
      html: '<p class="text-white">ลบข้อมูลเรียบร้อย</p>',
      background: '#424242',
      iconColor: '#7E57C2',
      showConfirmButton: false,
    })
    await fetchData()
  }
}

</script>

<style scoped>
.swal2-container {
  z-index: X;
}
</style>
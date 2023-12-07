<template>
  <div class="pt-5 h-100">
    <v-row>
      <v-col cols="12" sm="6" lg="2" class="p-0">
        <v-select v-model="currentMonthSummary" return-object :items="monthlySummary" item-title="date" item-value="date"
          variant="outlined" label="เดือน"></v-select>
      </v-col>
      <v-col cols="12" sm="6" lg="2" class="p-0">
        <v-select v-model="currentYearlySummary" return-object :items="yearlySummary" item-title="year" item-value="year"
          variant="outlined" label="ปี" @update:model-value="refreshChartData()"></v-select>
      </v-col>
      <v-col cols="12" sm="6" lg="2" class="p-0" v-if="families.length > 0">
        <v-select variant="outlined" return-object v-model="currentType" :items="typeItems" item-value="value"
          item-title="text" label="ประเภท" @update:model-value="changeData()"></v-select>
      </v-col>
      <v-col cols="12" sm="6" lg="2" class="p-0" v-show="currentType.value === 'family'">
        <v-select v-model="currentFamilyId" :items="families" item-title="name" item-value="id" variant="outlined"
          label="ครอบครัว" @update:model-value="fetchFamilySummary()"></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="bg-grey-darken-3">
          <v-card-title>รายรับ</v-card-title>
          <v-card-text>
            {{ currentMonthSummary.income }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="bg-grey-darken-3">
          <v-card-title>รายจ่าย</v-card-title>
          <v-card-text>
            {{ currentMonthSummary.expense }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="bg-grey-darken-3">
          <v-card-title>สรุป</v-card-title>
          <v-card-text>
            {{ currentMonthSummary.income - currentMonthSummary.expense }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="bg-grey-darken-3">
          <v-card-title>สรุปยอดค่าใช้จ่ายในแต่ละเดือน</v-card-title>
          <v-card-text>
            <summary-bar-chart :chart-data="currentMapYearlySummary" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { type MonthlySummary, type YearlySummary } from '~/types/expense.model';
import { type Family } from '../types/family.model'

const typeItems = [
  {
    text: 'ส่วนตัว',
    value: 'personal'
  },
  {
    text: 'ครอบครัว',
    value: 'family',
  }
]

const currentType = ref(typeItems[0])

const families: Ref<Family[]> = ref([]);

const currentFamilyId = ref(0);

const fetchFamily = async () => {
  const { data: response } = await useFetch<{ result: Family[] }>(
    "http://localhost:8000/families/getUserFamily",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  families.value = response.value?.result!;
};

const yearlySummary: Ref<YearlySummary[]> = ref([]);

const monthlySummary: Ref<MonthlySummary[]> = ref([]);

const currentMonthSummary: Ref<MonthlySummary> = ref({
  date: '',
  income: 0,
  expense: 0,
});

const currentYearlySummary: Ref<YearlySummary> = ref({
  year: '',
  summary: [{
    month: '',
    income: 0,
    expense: 0,
  }]
})

const currentUserMonthSummary: Ref<MonthlySummary[]> = ref([]);

const currentUserYearlySummary: Ref<YearlySummary[]> = ref([])

const fetchSummary = async () => {
  const { data: response } = await useFetch<{ result: { monthly: MonthlySummary[], yearly: YearlySummary[] } }>('http://localhost:8000/expenses/getUserSummary', {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (response.value?.result) {
    yearlySummary.value = response.value.result.yearly
    monthlySummary.value = response.value.result.monthly
    currentUserYearlySummary.value = response.value.result.yearly
    currentUserMonthSummary.value = response.value.result.monthly
    currentMonthSummary.value = monthlySummary.value[0]
    currentYearlySummary.value = yearlySummary.value[0]
    refreshChartData();
  }
}

onMounted(async () => {
  await fetchFamily()
  await fetchSummary()
})

const currentMapYearlySummary = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'รายรับ',
      data: [] as number[],
      backgroundColor: '#7E57C2',
    },
    {
      label: 'รายจ่าย',
      data: [] as number[],
      backgroundColor: '#5E35B1',
    },
  ],
});

const currentFamilyMonthSummary: Ref<MonthlySummary[]> = ref([]);

const currentFamilyYearlySummary: Ref<YearlySummary[]> = ref([])

const fetchFamilySummary = async () => {
  if (currentType.value.value === 'family') {
    const { data: response } = await useFetch<{ result: { monthly: MonthlySummary[], yearly: YearlySummary[] } }>('http://localhost:8000/expenses/getFamilySummary', {
      method: 'post',
      body: {
        familyId: currentFamilyId.value,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (response.value?.result) {
      yearlySummary.value = response.value.result.yearly
      monthlySummary.value = response.value.result.monthly
      currentFamilyMonthSummary.value = response.value.result.monthly
      currentFamilyYearlySummary.value = response.value.result.yearly
      currentMonthSummary.value = response.value.result.monthly[0]!
      currentYearlySummary.value = response.value.result.yearly[0]!
      refreshChartData();
    }
  } else {
    yearlySummary.value = currentUserYearlySummary.value
    monthlySummary.value = currentUserMonthSummary.value
    currentMonthSummary.value = monthlySummary.value[0]!
    currentYearlySummary.value = yearlySummary.value[0]!
    refreshChartData();
  }
}

const refreshChartData = () => {
  const newData = {
    labels: [] as string[],
    datasets: [
      {
        label: 'รายรับ',
        data: [] as number[],
        backgroundColor: '#7E57C2',
      },
      {
        label: 'รายจ่าย',
        data: [] as number[],
        backgroundColor: '#5E35B1',
      },
    ],
  };

  if (currentYearlySummary.value?.summary) {
    currentYearlySummary.value.summary.forEach((item) => {
      newData.datasets[0].data.push(item.income);
      newData.datasets[1].data.push(item.expense);
      newData.labels.push(item.month);
    })
    currentMapYearlySummary.value = newData;
  }


}

const changeData = () => {
  if (currentType.value.value === 'family' && currentFamilyId.value !== 0) {
    yearlySummary.value = currentFamilyYearlySummary.value
    monthlySummary.value = currentFamilyMonthSummary.value
    currentMonthSummary.value = monthlySummary.value[0]!
    currentYearlySummary.value = yearlySummary.value[0]!
    refreshChartData()
  } else {
    yearlySummary.value = currentUserYearlySummary.value
    monthlySummary.value = currentUserMonthSummary.value
    currentMonthSummary.value = monthlySummary.value[0]!
    currentYearlySummary.value = yearlySummary.value[0]!
  }
  refreshChartData();
}
</script>

<style scoped>
#side-card1,
#side-card2 {
  padding-bottom: 0px;
  height: 50%;
  /* Subtract any margin or padding you have if needed */
}
</style>
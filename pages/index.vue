<template>
  <div class="pt-5 h-100">
    <v-row>
      <v-col cols="12" sm="6" lg="2" class="p-0">
        <v-select variant="outlined" label="เดือน"></v-select>
      </v-col>
      <v-col cols="12" sm="6" lg="2" class="p-0">
        <v-select variant="outlined" label="ปี"></v-select>
      </v-col>
      <v-col cols="12" sm="6" lg="2" class="p-0">
        <v-select variant="outlined" v-model="currentType" :items="typeItems" item-value="value" item-title="text" label="ประเภท"></v-select>
      </v-col>
      <v-col cols="12" sm="6" lg="2" class="p-0" v-show="currentType === 'family'">
        <v-select variant="outlined" label="ครอบครัว"></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="bg-grey-darken-3">
          <v-card-title>รายรับ</v-card-title>
          <v-card-text>
            20,000
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="bg-grey-darken-3">
          <v-card-title>รายจ่าย</v-card-title>
          <v-card-text>
            20,000
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="bg-grey-darken-3">
          <v-card-title>ทั้งหมด</v-card-title>
          <v-card-text>
            20,000
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="h-100">
      <v-col :cols="currentType === 'family' ? '8' : '12'">
        <v-card class="bg-grey-darken-3">
          <v-card-title>สรุปยอดค่าใช้จ่ายในแต่ละเดือน</v-card-title>
          <v-card-text>
            <summary-bar-chart :chart-data="{ name: 'eiei' }" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="4" class="px-0 pt-0" v-show="currentType === 'family'">
        <div class="d-flex flex-column h-100">
          <v-col id="side-card1">
            <v-card class="bg-grey-darken-3 h-100">
              <v-card-title>2</v-card-title>
            </v-card>
          </v-col>

          <v-col id="side-card2">
            <v-card class="bg-grey-darken-3 h-100">
              <v-card-title>2</v-card-title>
            </v-card>
          </v-col>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const income = ref(0);
const exponse = ref(0);

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
</script>

<style scoped>
#side-card1,
#side-card2 {
  padding-bottom: 0px;
  height: 50%;
  /* Subtract any margin or padding you have if needed */
}
</style>
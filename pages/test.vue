<template>
  <div>
    <v-row>
      <v-col v-for="teacher in teachers" :key="teacher.id">
        <v-card>
          
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
const teachers = ref([
  {
    id: 1,
    name: 'อาจารย์1'
  },
  {
    id: 2,
    name: 'อาจารย์2'
  },
  {
    id: 3,
    name: 'อาจารย์3'
  },
  {
    id: 4,
    name: 'อาจารย์4'
  },
  {
    id: 5,
    name: 'อาจารย์5'
  },
  {
    id: 6,
    name: 'อาจารย์6'
  }
])
</script>
<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <expense-table />
      </v-col>
      <v-col cols="12" md="6">
        <income-table />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
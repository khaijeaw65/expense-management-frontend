<template>
  <v-card class="h-100">
    <v-navigation-drawer permanent expand-on-hover class="bg-deep-purple-darken-1" :disable-route-watcher="true">
      <v-list density="compact" nav class="center-list-items">
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard" to="/"/>
        <v-list-item prepend-icon="mdi-view-dashboard" title="ค่าใช้จ่าย" value="expense" to="/expense"/>
        <v-list-item prepend-icon="mdi-account-multiple" title="ครอบครัว" value="family" to="/family"></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<style scoped>
.center-list-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  /* Ensure the list takes up the full height of the drawer */
}
</style>
<script setup lang="ts">
const search = defineModel('search')
</script>

<template>
  <input
      type="text"
      placeholder="Cercar..."
      v-model="search"
      class="w-full p-2.5 mb-4 border border-gray-400 rounded-md md:w-1/2"
  />
</template>

<style scoped>

</style>

<script setup lang="ts">
import {chevronLeft, chevronRight} from "../../../assets/icons/icons.ts";
const emit = defineEmits(['updatePage']);

defineProps<{
      page: number;
      totalPages: number;
  }>()

const updatePage = (newPage: number) => {
  emit('updatePage', newPage);
};

</script>

<template>
  <div class="flex items-center gap-2.5">
    <button @click="updatePage(page - 1)" :disabled="page <= 1" class="disabled:opacity-50 disabled:cursor-not-allowed">
      <span v-html="chevronLeft"></span>
    </button>
    <span>Pàgina {{ page }} de {{ totalPages }}</span>
    <button @click="updatePage(page + 1)" :disabled="page >= totalPages" class="disabled:opacity-50 disabled:cursor-not-allowed">
      <span v-html="chevronRight"></span>
    </button>
  </div>
</template>

<style scoped>

</style>

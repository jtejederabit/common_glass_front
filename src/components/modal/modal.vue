<script setup lang="ts">
const emit = defineEmits(['toggle']);

const props = defineProps<{
  visible: boolean;
}>();

const clickOutside = (event: MouseEvent) => {
  if (!(event.target as HTMLElement).closest('#modal-content')) {
    emit('toggle');
  }
};

const close = () => {
  emit('toggle');
};
</script>

<template>
  <div v-if="props.visible" @click="clickOutside" class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
    <div id="modal-content" class="bg-white p-5 rounded-none  w-full h-full flex flex-col overflow-hidden md:w-[700px] md:h-[500px] md:p-4 md:rounded-lg">
      <div class=" flex justify-between items-center w-full">
        <span>
          <slot name="header"></slot>
        </span>
        <button class="text-gray-400 text-4xl font-bold cursor-pointer" @click="close">&times;</button>
      </div>
      <div class="overflow-x-auto">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

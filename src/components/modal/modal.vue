<script setup lang="ts">
const emit = defineEmits(['toggle']);

const props = defineProps<{
  visible: boolean;
}>();

const clickOutside = (event: MouseEvent) => {
  if (!(event.target as HTMLElement).closest('.modal-content')) {
    emit('toggle');
  }
};

</script>

<template>
  <div v-if="props.visible" @click="clickOutside">
    <div class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <span>
            <slot name="header"></slot>
          </span>
          <span class="close" @click="emit('toggle')">&times;</span>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.modal-content {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 700px;
  height: 500px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.modal-body {
  overflow-x: auto;
}
</style>

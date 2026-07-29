<template>
  <span
    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
    :style="{
      backgroundColor: status?.color + '20',
      color: status?.color,
    }"
  >
    {{ status?.name || '-' }}
  </span>
</template>

<script setup>
defineProps({
  status: {
    type: Object,
    default: () => ({}),
  },
})
</script>

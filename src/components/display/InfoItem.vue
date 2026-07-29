<template>
  <div>
    <div class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
      {{ label }}
    </div>

    <div class="text-sm font-semibold text-black dark:text-white">
      {{ value || '-' }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },

  value: {
    type: [String, Number],
    default: '-',
  },
})
</script>

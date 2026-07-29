<template>
  <span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold" :class="badgeClass">
    {{ usage?.label || '-' }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  usage: {
    type: Object,
    default: () => ({}),
  },
})

const badgeClass = computed(() => {
  switch (props.usage?.code) {
    case 'AVAILABLE':
      return 'bg-green-100 text-green-700'

    case 'ASSIGNED':
      return 'bg-blue-100 text-blue-700'

    case 'MAINTENANCE':
      return 'bg-yellow-100 text-yellow-700'

    case 'DISPOSED':
      return 'bg-red-100 text-red-700'

    default:
      return 'bg-gray-100 text-gray-600'
  }
})
</script>

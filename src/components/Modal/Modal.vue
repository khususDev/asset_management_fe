<template>
  <div
    v-if="show"
    class="fixed inset-0 z-999999 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 px-4 py-6"
  >
    <div
      :class="[
        'relative w-full rounded-lg bg-white shadow-xl dark:bg-boxdark transition-all',
        maxWidthClass,
      ]"
    >
      <div
        class="flex items-center justify-between border-b border-stroke py-4 px-6 dark:border-strokedark"
      >
        <h3 class="font-medium text-black dark:text-white">
          {{ title }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div>
        <slot></slot>
      </div>

      <div
        v-if="$slots.footer"
        class="flex items-center justify-end gap-4 border-t border-stroke py-4 px-6 dark:border-strokedark"
      >
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: Boolean,
  title: String,
  // Tambahkan props maxWidth dengan nilai bawaan (default)
  maxWidth: {
    type: String,
    default: '2xl', // Ini adalah ukuran Modal Anda yang biasa (Master Data)
  },
})

defineEmits(['close'])

// Mapping class Tailwind agar aman saat di-compile (JIT compiler Tailwind tidak suka string dinamis murni)
const maxWidthClass = computed(() => {
  const classes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl', // Ukuran standar sebelumnya
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl', // Cocok untuk Purchase Request
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl', // Sangat lebar, hampir penuh layar
    full: 'max-w-full',
  }
  return classes[props.maxWidth] || classes['2xl']
})
</script>

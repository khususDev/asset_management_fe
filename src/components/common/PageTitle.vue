<!-- src/components/common/PageTitle.vue -->
<template>
  <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <!-- Bagian Judul Utama & Garis Aksen -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ title }}
      </h1>
      <div class="h-1 w-16 bg-blue-600 rounded-full mt-2"></div>
    </div>

    <!-- Slot Opsional (Untuk Tombol Aksi di Sebelah Kanan Judul) -->
    <div v-if="$slots.actions" class="flex items-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

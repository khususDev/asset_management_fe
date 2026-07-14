<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="toastStore.show"
      class="fixed top-5 right-5 z-999999 flex w-full max-w-sm rounded-lg border-3 bg-white p-4 shadow-xl dark:bg-boxsuccess"
      :class="
        toastStore.type === 'success' ? 'border-success bg-success/5' : 'border-danger bg-danger/5'
      "
    >
      <!-- Lingkaran Icon (Diperbesar sedikit jadi h-7 w-7 agar seimbang dengan font baru) -->
      <div
        class="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
        :class="toastStore.type === 'success' ? 'bg-success' : 'bg-danger'"
      >
        <!-- IKON 1: Centang (Menggunakan v-if mandiri) -->
        <svg
          v-if="toastStore.icon === 'check'"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="3"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>

        <!-- IKON 2: Pensil Edit (Menggunakan v-if mandiri) -->
        <svg
          v-if="toastStore.icon === 'edit'"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>

        <!-- IKON 3: Tong Sampah (Menggunakan v-if mandiri) -->
        <svg
          v-if="toastStore.icon === 'trash'"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>

        <!-- IKON 4: Silang / Error (Menggunakan v-if mandiri) -->
        <svg
          v-if="toastStore.icon === 'error'"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="3"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <!-- Konten Teks -->
      <div class="flex-1 text-left">
        <!-- Ukuran Judul dinaikkan ke text-base (~14px) agar lebih tegas -->
        <h5 class="font-bold text-black dark:text-white text-base">
          {{ toastStore.type === 'success' ? 'Sukses' : 'Gagal' }}
        </h5>
        <!-- Ukuran Pesan dinaikkan ke text-sm (~13px) agar nyaman dibaca -->
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5 font-medium">
          {{ toastStore.message }}
        </p>
      </div>

      <!-- Tombol Close Manual (Diperbesar ke text-sm) -->
      <button
        @click="toastStore.show = false"
        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2 align-top text-sm font-bold"
      >
        ✕
      </button>
    </div>
  </transition>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'
const toastStore = useToastStore()
</script>

<template>
  <div class="flex items-center justify-center gap-3">
    <!-- View (Gunakan v-if="showView") -->
    <button
      v-if="showView"
      @click="$emit('view')"
      :disabled="disabled"
      class="text-gray-500 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="View Detail"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        ></path>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        ></path>
      </svg>
    </button>

    <!-- Post -->
    <button
      v-if="showPost"
      @click="$emit('post')"
      :disabled="disabled"
      class="text-gray-500 hover:text-success transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Post GR"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    </button>

    <!-- Print (Gunakan v-if="showPrint") -->
    <button
      v-if="showPrint"
      @click="$emit('print')"
      :disabled="disabled"
      class="text-gray-500 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Cetak PDF"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2zm5-17V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3"
        ></path>
      </svg>
    </button>

    <!-- Edit & Delete -->
    <template v-if="showEditDelete">
      <button
        @click="$emit('edit')"
        :disabled="disabled"
        class="text-gray-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
        title="Edit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>
      <button
        @click="$emit('delete')"
        :disabled="disabled"
        class="text-gray-600 hover:text-danger disabled:opacity-50 disabled:cursor-not-allowed"
        title="Hapus"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    </template>
  </div>
</template>

<script setup>
defineProps({
  disabled: { type: Boolean, default: false },
  showView: { type: Boolean, default: false }, // Default false
  showPrint: { type: Boolean, default: false }, // Default false
  showEditDelete: { type: Boolean, default: false }, // Default false
  showPost: { type: Boolean, default: false }, // Default false
})
defineEmits(['view', 'print', 'edit', 'delete', 'post'])
</script>

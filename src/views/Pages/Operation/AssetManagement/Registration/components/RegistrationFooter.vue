<template>
  <div
    class="mt-8 flex items-center justify-between rounded-lg border border-stroke bg-gray-50 px-6 py-5 dark:border-strokedark dark:bg-meta-4"
  >
    <!-- Left -->

    <div>
      <h4 class="font-semibold text-black dark:text-white">Asset Registration</h4>

      <p class="mt-1 text-sm text-gray-500">
        Pastikan seluruh data sudah benar sebelum melakukan registrasi aset.
      </p>
    </div>

    <!-- Right -->

    <div class="flex items-center gap-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="rounded border border-stroke px-6 py-2 text-sm font-medium text-black transition hover:bg-gray-100 dark:border-strokedark dark:text-white"
      >
        Cancel
      </button>

      <button
        type="submit"
        :disabled="loading"
        class="rounded bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span v-if="loading"> Saving... </span>

        <span v-else> Register Asset </span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,

    default: false,
  },
})

defineEmits(['cancel'])
</script>

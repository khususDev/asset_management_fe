<template>
  <div
    v-if="show"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 transition-opacity"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-boxdark">
      <div class="mb-4 flex items-center justify-between border-b pb-3 dark:border-strokedark">
        <h3 class="text-lg font-semibold text-black dark:text-white">Cetak Label Barcode</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          ✕
        </button>
      </div>

      <div class="space-y-4">
        <!-- Scope Pencetakan -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-black dark:text-white">
            Cakupan Asset
          </label>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                value="ALL"
                v-model="form.print_scope"
                class="text-primary focus:ring-primary"
              />
              <span>Semua Asset Terfilter ({{ totalFiltered }} items)</span>
            </label>
            <label
              class="flex items-center gap-2 text-sm cursor-pointer"
              :class="{ 'opacity-50 cursor-not-allowed': selectedCount === 0 }"
            >
              <input
                type="radio"
                value="SELECTED"
                v-model="form.print_scope"
                :disabled="selectedCount === 0"
                class="text-primary focus:ring-primary"
              />
              <span>Hanya yang Dicentang ({{ selectedCount }} terpilih)</span>
            </label>
          </div>
        </div>

        <!-- Ukuran Kertas / Format Label -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-black dark:text-white">
            Format / Kertas Stiker
          </label>
          <select
            v-model="form.paper_size"
            class="w-full rounded border border-stroke bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-strokedark"
          >
            <option value="A4">Kertas A4 Sticker Sheet (Grid 3 Col)</option>
            <option value="THERMAL">Thermal Roll Label (50mm x 30mm)</option>
          </select>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex justify-end gap-3 border-t pt-4 dark:border-strokedark">
        <button
          type="button"
          @click="$emit('close')"
          class="rounded border border-stroke px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4"
        >
          Batal
        </button>
        <button
          type="button"
          @click="handlePrint"
          :disabled="isPrinting"
          class="inline-flex items-center gap-2 rounded bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          <span v-if="isPrinting">Menyiapkan PDF...</span>
          <span v-else>Cetak Label</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  selectedCount: {
    type: Number,
    default: 0,
  },
  totalFiltered: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['close', 'print'])

const isPrinting = ref(false)
const form = ref({
  print_scope: 'ALL',
  paper_size: 'A4',
})

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      form.value.print_scope = props.selectedCount > 0 ? 'SELECTED' : 'ALL'
      isPrinting.value = false
    }
  },
)

const handlePrint = () => {
  isPrinting.value = true
  emit('print', {
    print_scope: form.value.print_scope,
    paper_size: form.value.paper_size,
  })
}
</script>

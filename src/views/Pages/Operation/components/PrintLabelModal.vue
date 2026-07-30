<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" class="relative z-99999" @close="$emit('close')">
      <TransitionChild
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-6">
          <TransitionChild
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-xl rounded-xl bg-white shadow-xl dark:bg-boxdark">
              <div class="border-b border-stroke px-6 py-4 dark:border-strokedark">
                <DialogTitle class="text-xl font-semibold"> Print Asset Label </DialogTitle>

                <p class="mt-1 text-sm text-gray-500">Generate QR Label dalam format A4.</p>
              </div>

              <div class="space-y-6 p-6">
                <!-- Scope -->
                <div>
                  <label class="mb-3 block text-sm font-medium"> Print Scope </label>

                  <div class="space-y-2">
                    <label class="flex items-center gap-3">
                      <input v-model="form.scope" value="filtered" type="radio" />
                      <span>All Filtered Asset</span>
                    </label>

                    <label class="flex items-center gap-3">
                      <input v-model="form.scope" value="selected" type="radio" />
                      <span>Selected Asset</span>
                    </label>
                  </div>
                </div>

                <!-- Label Size -->
                <div>
                  <label class="mb-3 block text-sm font-medium"> Label Size </label>

                  <select
                    v-model="form.size"
                    class="w-full rounded-lg border border-stroke px-3 py-2"
                  >
                    <option value="50x30">50 x 30 mm</option>

                    <option value="70x40">70 x 40 mm</option>

                    <option value="100x50">100 x 50 mm</option>
                  </select>
                </div>

                <!-- Preview -->
                <div class="rounded-lg border border-dashed border-stroke p-4">
                  <div class="mb-3 font-medium">Preview</div>

                  <div class="grid grid-cols-4 gap-3">
                    <div v-for="n in 8" :key="n" class="rounded border p-2 text-center">
                      <div class="mx-auto mb-2 h-12 w-12 rounded border"></div>

                      <div class="text-[10px]">AST-000{{ n }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="flex justify-end gap-3 border-t border-stroke px-6 py-4 dark:border-strokedark"
              >
                <button class="rounded-lg border px-5 py-2" @click="$emit('close')">Cancel</button>

                <button
                  class="rounded-lg bg-primary px-5 py-2 text-white"
                  @click="$emit('print', form)"
                >
                  Generate PDF
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { reactive } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

defineProps({
  show: Boolean,
})

defineEmits(['close', 'print'])

const form = reactive({
  scope: 'filtered',
  size: '50x30',
})
</script>

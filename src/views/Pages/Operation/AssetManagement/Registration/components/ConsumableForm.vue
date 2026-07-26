<template>
  <div class="space-y-6">
    <div
      class="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div class="border-b border-stroke px-6 py-4">
        <h3 class="text-lg font-semibold text-black dark:text-white">Consumable Information</h3>

        <p class="mt-1 text-sm text-gray-500">Lengkapi informasi dasar barang consumable.</p>
      </div>

      <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        <!-- Asset Category -->

        <div>
          <label class="mb-2 block text-sm font-medium">
            Asset Category
            <span class="text-danger">*</span>
          </label>

          <select
            v-model="model.asset_category_id"
            class="w-full rounded border border-stroke px-4 py-2.5"
          >
            <option value="">-- Select Category --</option>

            <option v-for="item in masters.categories" :key="item.id" :value="item.id">
              {{ item.code }} - {{ item.name }}
            </option>
          </select>
        </div>

        <!-- Asset Type -->

        <div>
          <label class="mb-2 block text-sm font-medium">
            Asset Type
            <span class="text-danger">*</span>
          </label>

          <select
            v-model="model.asset_type_id"
            class="w-full rounded border border-stroke px-4 py-2.5"
          >
            <option value="">-- Select Type --</option>

            <option v-for="item in filteredTypes" :key="item.id" :value="item.id">
              {{ item.code }} - {{ item.name }}
            </option>
          </select>
        </div>

        <!-- Branch -->

        <div>
          <label class="mb-2 block text-sm font-medium">
            Branch
            <span class="text-danger">*</span>
          </label>

          <select v-model="model.branch_id" class="w-full rounded border border-stroke px-4 py-2.5">
            <option value="">-- Select Branch --</option>

            <option v-for="item in masters.branchs" :key="item.id" :value="item.id">
              {{ item.code }} - {{ item.name }}
            </option>
          </select>
        </div>

        <!-- Status -->

        <div>
          <label class="mb-2 block text-sm font-medium">
            Asset Status
            <span class="text-danger">*</span>
          </label>

          <select v-model="model.status_id" class="w-full rounded border border-stroke px-4 py-2.5">
            <option value="">-- Select Status --</option>

            <option v-for="item in masters.statuses" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>

        <!-- Location -->

        <div class="md:col-span-2">
          <label class="mb-2 block text-sm font-medium">
            Storage Location
            <span class="text-danger">*</span>
          </label>

          <select
            v-model="model.location_id"
            class="w-full rounded border border-stroke px-4 py-2.5"
          >
            <option value="">-- Select Location --</option>

            <option v-for="item in masters.locations" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>

        <!-- Remark -->

        <div class="md:col-span-2">
          <label class="mb-2 block text-sm font-medium"> Remarks </label>

          <textarea
            rows="4"
            v-model="model.remarks"
            class="w-full rounded border border-stroke px-4 py-3"
            placeholder="Additional information..."
          >
          </textarea>
        </div>
      </div>
    </div>

    <!-- ===================================================== -->
    <!-- INFORMATION -->
    <!-- ===================================================== -->

    <!-- <div class="rounded-lg border border-warning bg-warning/5 p-5">
      <div class="flex gap-3">
        <div class="mt-0.5">
          <svg class="h-5 w-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 1112 3a9 9 0 019 9z"
            />
          </svg>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { computed } from 'vue'

const model = defineModel()

const props = defineProps({
  masters: {
    type: Object,

    required: true,
  },
})

const filteredTypes = computed(() => {
  if (!model.value.asset_category_id) return []

  return props.masters.types.filter(
    (item) => item.asset_category_id == model.value.asset_category_id,
  )
})
</script>

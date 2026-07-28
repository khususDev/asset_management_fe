<template>
  <div class="space-y-6">
    <!-- ===================================================== -->
    <!-- LICENSE INFORMATION -->
    <!-- ===================================================== -->

    <div
      class="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div class="border-b border-stroke px-6 py-4">
        <h3 class="text-lg font-semibold text-black dark:text-white">License Information</h3>

        <p class="mt-1 text-sm text-gray-500">Lengkapi informasi lisensi software.</p>
      </div>

      <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        <!-- License Key -->

        <div class="md:col-span-2">
          <label class="mb-2 block text-sm font-medium">
            License Key
            <span class="text-danger">*</span>
          </label>

          <textarea
            rows="3"
            v-model="model.serial_number"
            format="UPPERCASE"
            class="w-full rounded border border-stroke px-4 py-3"
            placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
          >
          </textarea>
        </div>

        <!-- Category -->

        <div>
          <label class="mb-2 block text-sm font-medium"> Asset Category </label>

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

        <!-- Type -->

        <div>
          <label class="mb-2 block text-sm font-medium"> Asset Type </label>

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

        <!-- Brand -->

        <div>
          <label class="mb-2 block text-sm font-medium"> Software Vendor </label>

          <select v-model="model.brand_id" class="w-full rounded border border-stroke px-4 py-2.5">
            <option value="">-- Select Vendor --</option>

            <option v-for="item in masters.brands" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>

        <!-- Product -->

        <div>
          <label class="mb-2 block text-sm font-medium"> Product </label>

          <select v-model="model.model_id" class="w-full rounded border border-stroke px-4 py-2.5">
            <option value="">-- Select Product --</option>

            <option v-for="item in filteredModels" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- ===================================================== -->
    <!-- LICENSE PERIOD -->
    <!-- ===================================================== -->

    <div
      class="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div class="border-b border-stroke px-6 py-4">
        <h3 class="text-lg font-semibold">License Period</h3>
      </div>

      <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
        <div>
          <label class="mb-2 block text-sm font-medium"> Activation Date </label>

          <DateInput v-model="model.warranty_start" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium"> Expired Date </label>

          <DateInput v-model="model.warranty_end" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium"> Subscription (Month) </label>

          <input
            type="number"
            min="1"
            v-model="model.useful_life"
            class="w-full rounded border border-stroke px-4 py-2.5"
          />
        </div>
      </div>
    </div>

    <!-- ===================================================== -->
    <!-- ORGANIZATION -->
    <!-- ===================================================== -->

    <div
      class="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div class="border-b border-stroke px-6 py-4">
        <h3 class="text-lg font-semibold">Organization</h3>
      </div>

      <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-medium"> Branch </label>

          <select v-model="model.branch_id" class="w-full rounded border border-stroke px-4 py-2.5">
            <option value="">-- Select Branch --</option>

            <option v-for="item in masters.branchs" :key="item.id" :value="item.id">
              {{ item.code }} - {{ item.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium"> License Status </label>

          <select v-model="model.status_id" class="w-full rounded border border-stroke px-4 py-2.5">
            <option value="">-- Select Status --</option>

            <option v-for="item in masters.statuses" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="mb-2 block text-sm font-medium"> Remarks </label>

          <textarea
            rows="4"
            v-model="model.remarks"
            class="w-full rounded border border-stroke px-4 py-3"
          >
          </textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import DateInput from '@/components/Form/DateInput.vue'

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

const filteredModels = computed(() => {
  if (!model.value.brand_id) return []

  return props.masters.models.filter((item) => item.brand_id == model.value.brand_id)
})
</script>

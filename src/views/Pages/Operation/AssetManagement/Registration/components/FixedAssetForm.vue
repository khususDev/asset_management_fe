<template>
  <div class="space-y-6">
    <!-- ===================================================== -->
    <!-- IDENTIFICATION -->
    <!-- ===================================================== -->

    <div
      class="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div class="border-b border-stroke px-6 py-4">
        <h3 class="text-lg font-semibold">Asset Identification</h3>
      </div>

      <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        <!-- Serial Number -->

        <div>
          <label class="mb-2 block text-sm font-medium"> Serial Number </label>

          <input
            v-model="model.serial_number"
            type="text"
            class="w-full rounded border border-stroke px-4 py-2.5"
            placeholder="Input Serial Number"
          />
        </div>

        <!-- Category -->

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

        <!-- Type -->

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

            <option v-for="item in masters.branches" :key="item.id" :value="item.id">
              {{ item.code }} - {{ item.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- ===================================================== -->
    <!-- BRAND -->
    <!-- ===================================================== -->

    <div
      class="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div class="border-b border-stroke px-6 py-4">
        <h3 class="text-lg font-semibold">Brand Information</h3>
      </div>

      <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        <!-- Brand -->

        <div>
          <label class="mb-2 block text-sm font-medium"> Brand </label>

          <select v-model="model.brand_id" class="w-full rounded border border-stroke px-4 py-2.5">
            <option value="">-- Select Brand --</option>

            <option v-for="item in masters.brands" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>

        <!-- Model -->

        <div>
          <label class="mb-2 block text-sm font-medium"> Model </label>

          <select v-model="model.model_id" class="w-full rounded border border-stroke px-4 py-2.5">
            <option value="">-- Select Model --</option>

            <option v-for="item in filteredModels" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- ===================================================== -->
    <!-- WARRANTY -->
    <!-- ===================================================== -->

    <div
      class="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div class="border-b border-stroke px-6 py-4">
        <h3 class="text-lg font-semibold">Warranty</h3>
      </div>

      <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
        <div>
          <label class="mb-2 block text-sm font-medium"> Warranty Start </label>

          <DateInput v-model="model.warranty_start" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium"> Warranty End </label>

          <DateInput v-model="model.warranty_end" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium"> Useful Life (Year) </label>

          <input
            type="number"
            min="0"
            v-model="model.useful_life"
            class="w-full rounded border border-stroke px-4 py-2.5"
          />
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
  masters: Object,
})

const filteredTypes = computed(() => {
  return props.masters.types.filter(
    (item) => item.asset_category_id == model.value.asset_category_id,
  )
})

const filteredModels = computed(() => {
  return props.masters.models.filter((item) => item.brand_id == model.value.brand_id)
})
</script>

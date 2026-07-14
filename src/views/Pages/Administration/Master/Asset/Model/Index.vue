<template>
  <div class="mx-auto max-w-screen-2xl">
    <Breadcrumb pageTitle="Asset Models" :crumbs="['Administration', 'Asset Master', 'Models']" />

    <DataTable
      :headers="['Code', 'Model Name', 'Brand', 'Description', 'Status', 'Action']"
      :from="modelsData.from"
      :to="modelsData.to"
      :total="modelsData.total"
      :search="search"
      :entries="entries"
      @search="search = $event"
      @update:entries="entries = $event"
    >
      <template #top-actions>
        <button
          @click="openCreate"
          class="rounded bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
        >
          Tambah Model
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="6" />

      <tr
        v-else
        v-for="model in modelsData.data"
        :key="model.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center font-medium text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ model.code }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ model.name }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ model.brand ? model.brand.name : '-' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-gray-500 dark:text-gray-400 truncate max-w-[250px] last:border-r-0 dark:border-strokedark"
        >
          {{ model.description || '-' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <StatusBadge :active="model.is_active" />
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <TableAction @edit="openEdit(model)" @delete="openDelete(model.id)" />
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!modelsData.data || modelsData.data.length === 0)"
        :colspan="6"
      />

      <template #pagination>
        <Pagination :links="modelsData.links" @change-page="fetchModels" />
      </template>
    </DataTable>

    <Modal :show="showModal" :title="isEdit ? 'Edit Model' : 'Tambah Model'" @close="closeModal">
      <div class="p-6 flex flex-col gap-4">
        <FormSelect
          label="Asset Brand (Merk)"
          v-model="form.brand_id"
          :options="brandsList"
          :error="errors?.brand_id ? errors.brand_id[0] : null"
        />

        <FormInput
          label="Model Code"
          v-model="form.code"
          format="uppercase"
          :disabled="isEdit"
          :error="errors?.code ? errors.code[0] : null"
          placeholder="e.g., T14, AVNZ-G, INNV-ZX"
        />

        <FormInput
          label="Model Name"
          v-model="form.name"
          format="title"
          :error="errors?.name ? errors.name[0] : null"
          placeholder="e.g., ThinkPad T14, Avanza 1.5 G"
        />

        <div>
          <label class="mb-2.5 block text-sm font-medium text-black dark:text-white"
            >Description</label
          >
          <textarea
            v-model="form.description"
            rows="3"
            format="capitalize"
            placeholder="Model specifications or details..."
            class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            :class="{ 'border-danger focus:border-danger': errors?.description }"
          ></textarea>
          <p v-if="errors?.description" class="mt-1 text-xs text-danger">
            {{ errors.description[0] }}
          </p>
        </div>

        <FormCheckbox label="Active Status" v-model="form.is_active" />
      </div>

      <template #footer>
        <button
          @click="closeModal"
          class="px-4 py-2 text-black dark:text-white hover:text-opacity-80"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          :disabled="loading"
          class="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50 transition-all"
        >
          {{ loading ? 'Saving...' : 'Simpan' }}
        </button>
      </template>
    </Modal>

    <ConfirmModal :show="showDeleteModal" @close="closeDeleteModal" @confirm="handleDelete" />
  </div>
</template>

<script setup>
import { API_BASE_URL, API_ENDPOINTS } from '@/api/endpoints'

import { ref, onMounted } from 'vue'
import axios from 'axios'

import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import DataTable from '@/Components/Table/DataTable.vue'
import Pagination from '@/Components/Table/Pagination.vue'
import TableAction from '@/Components/Table/TableAction.vue'
import TableEmpty from '@/Components/Table/TableEmpty.vue'
import TableLoading from '@/Components/Table/TableLoading.vue'
import FormInput from '@/Components/Form/FormInput.vue'
import FormCheckbox from '@/Components/Form/FormCheckbox.vue'
import FormSelect from '@/Components/Form/FormSelect.vue'
import Modal from '@/Components/Modal/Modal.vue'
import ConfirmModal from '@/Components/Modal/ConfirmModal.vue'
import StatusBadge from '@/Components/Badge/StatusBadge.vue'

import useCrud from '@/Composables/useCrud'
import useTable from '@/Composables/useTable'

// --- STATE MANAGEMENT ---
const modelsData = ref({})
const brandsList = ref([]) // State menampung list merk untuk dropdown form
const isFetching = ref(false)

const apiUrl = API_ENDPOINTS.asmModel
const brandsUrl = API_ENDPOINTS.asmBrand

// --- SETUP TABLE ---
const { search, entries } = useTable(
  {
    search: '',
    entries: 10,
  },
  () => fetchModels(),
)

// --- FETCH DATA MODELS ---
const fetchModels = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
    })
    modelsData.value = response.data.data
  } catch (error) {
    console.error('Gagal load data asset models', error)
  } finally {
    isFetching.value = false
  }
}

// --- FETCH DATA BRANDS (Untuk Dropdown Form Pilihan) ---
const fetchBrandsList = async () => {
  try {
    const response = await axios.get(brandsUrl, { params: { entries: 100 } })
    brandsList.value = response.data.data.data || response.data.data
  } catch (error) {
    console.error('Gagal load daftar brand untuk dropdown', error)
  }
}

// --- SETUP CRUD COMPOSABLE ---
const {
  form,
  errors,
  showModal,
  showDeleteModal,
  isEdit,
  loading,
  openCreate,
  openEdit,
  closeModal,
  submit,
  openDelete,
  closeDeleteModal,
  confirmDelete,
} = useCrud({
  initialForm: {
    brand_id: '',
    code: '',
    name: '',
    description: '',
    is_active: true,
  },
  storeRoute: apiUrl,
  updateRoute: apiUrl,
  deleteRoute: apiUrl,
})

// --- LIFECYCLE ---
onMounted(() => {
  fetchModels()
  fetchBrandsList() // Mengisi list dropdown brand saat komponen dimuat
})

const handleSubmit = () => {
  submit(fetchModels)
}

const handleDelete = () => {
  confirmDelete(fetchModels)
}
</script>

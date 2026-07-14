<template>
  <div class="mx-auto max-w-screen-2xl">
    <Breadcrumb
      pageTitle="Master Locations"
      :crumbs="['Administration', 'Organization', 'Locations']"
    />

    <DataTable
      :headers="['Code', 'Location Name', 'Branch', 'Description', 'Status', 'Action']"
      :from="locationsData.from"
      :to="locationsData.to"
      :total="locationsData.total"
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
          Tambah Lokasi
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="6" />

      <tr
        v-else
        v-for="location in locationsData.data"
        :key="location.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center font-medium text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ location.code }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ location.name }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center uppercase text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ location.branch ? location.branch.name : '-' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-gray-500 dark:text-gray-400 truncate max-w-[250px] last:border-r-0 dark:border-strokedark"
        >
          {{ location.description || '-' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <StatusBadge :active="location.is_active" />
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <TableAction @edit="openEdit(location)" @delete="openDelete(location.id)" />
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!locationsData.data || locationsData.data.length === 0)"
        :colspan="6"
      />

      <template #pagination>
        <Pagination :links="locationsData.links" @change-page="fetchLocations" />
      </template>
    </DataTable>

    <Modal :show="showModal" :title="isEdit ? 'Edit Lokasi' : 'Tambah Lokasi'" @close="closeModal">
      <div class="p-6 flex flex-col gap-4">
        <FormSelect
          label="Branch (Cabang)"
          v-model="form.branch_id"
          :options="branchesList"
          :error="errors?.branch_id ? errors.branch_id[0] : null"
        />

        <FormInput
          label="Location Code"
          v-model="form.code"
          format="uppercase"
          :disabled="isEdit"
          :error="errors?.code ? errors.code[0] : null"
          placeholder="e.g., R-SERVER, GUDANG-A"
        />

        <FormInput
          label="Location Name"
          v-model="form.name"
          format="title"
          :error="errors?.name ? errors.name[0] : null"
          placeholder="e.g., Ruang Server Utama"
        />

        <div>
          <label class="mb-2.5 block text-sm font-medium text-black dark:text-white"
            >Description</label
          >
          <textarea
            v-model="form.description"
            rows="3"
            format="capitalize"
            placeholder="Location detail description..."
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
const locationsData = ref({})
const branchesList = ref([]) // Untuk menampung data pilihan dropdown cabang
const isFetching = ref(false)

const apiUrl = API_ENDPOINTS.orgLocation
const branchesUrl = API_ENDPOINTS.orgBranch

// --- SETUP TABLE ---
const { search, entries } = useTable(
  {
    search: '',
    entries: 10,
  },
  () => fetchLocations(),
)

// --- FETCH DATA LOCATIONS ---
const fetchLocations = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
    })
    locationsData.value = response.data.data
  } catch (error) {
    console.error('Gagal load data locations', error)
  } finally {
    isFetching.value = false
  }
}

// --- FETCH DATA BRANCHES (Untuk Dropdown Pilihan) ---
const fetchBranchesList = async () => {
  try {
    // Ambil data cabang dengan entries yang cukup besar agar masuk semua ke dropdown list
    const response = await axios.get(branchesUrl, { params: { entries: 100 } })
    // Menyesuaikan struktur response pembungkus data paginasinya
    branchesList.value = response.data.data.data || response.data.data
  } catch (error) {
    console.error('Gagal load daftar cabang untuk dropdown', error)
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
    branch_id: '',
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
  fetchLocations()
  fetchBranchesList() // Jalankan pengisian dropdown cabang saat halaman dimuat
})

const handleSubmit = () => {
  submit(fetchLocations)
}

const handleDelete = () => {
  confirmDelete(fetchLocations)
}
</script>

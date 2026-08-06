<template>
  <div class="mx-auto max-w-screen-2xl">
    <PageTitle title="Master Asset Types" />

    <DataTable
      :headers="['Code', 'Type Name', 'Category', 'Description', 'Status', 'Action']"
      :from="typesData.from"
      :to="typesData.to"
      :total="typesData.total"
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
          Create Type
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="6" :cols="6" />

      <tr
        v-else
        v-for="type in typesData.data"
        :key="type.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center font-medium text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ type.code }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ type.name }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ type.category ? type.category.name : '-' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-gray-500 dark:text-gray-400 truncate max-w-[250px] last:border-r-0 dark:border-strokedark"
        >
          {{ type.description || '-' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <StatusBadge :active="type.is_active" />
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <TableAction show-edit-delete @edit="openEdit(type)" @delete="openDelete(type.id)" />
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!typesData.data || typesData.data.length === 0)"
        :colspan="6"
      />

      <template #pagination>
        <Pagination :links="typesData.links" @change-page="fetchTypes" />
      </template>
    </DataTable>

    <Modal :show="showModal" :title="isEdit ? 'Edit Tipe' : 'Tambah Tipe'" @close="closeModal">
      <div class="p-6 flex flex-col gap-4">
        <FormSelect
          label="Asset Category"
          v-model="form.asset_category_id"
          :options="categoriesList"
          :error="errors?.asset_category_id ? errors.asset_category_id[0] : null"
        />

        <FormInput
          label="Type Code"
          v-model="form.code"
          format="uppercase"
          :error="errors?.code ? errors.code[0] : null"
          placeholder="e.g., LPT, SRV, MBL"
        />

        <FormInput
          label="Type Name"
          v-model="form.name"
          format="uppercase"
          :error="errors?.name ? errors.name[0] : null"
          placeholder="e.g., Laptop, Server, Mobil Penumpang"
        />

        <div>
          <label class="mb-2.5 block text-sm font-medium text-black dark:text-white"
            >Description</label
          >
          <textarea
            v-model="form.description"
            rows="3"
            format="capitalize"
            placeholder="Type details..."
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
import { API_ENDPOINTS } from '@/api/endpoints'
import PageTitle from '@/Components/common/PageTitle.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
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
const typesData = ref({})
const categoriesList = ref([])
const isFetching = ref(false)

const apiUrl = API_ENDPOINTS.asmType
const categoriesUrl = API_ENDPOINTS.asmCategory

// --- SETUP TABLE ---
const { search, entries } = useTable(
  {
    search: '',
    entries: 10,
  },
  () => fetchTypes(),
)

// --- FETCH DATA TYPES ---
const fetchTypes = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
    })
    typesData.value = response.data.data
  } catch (error) {
    console.error('Gagal load data asset types', error)
  } finally {
    isFetching.value = false
  }
}

// --- FETCH DATA CATEGORIES (Untuk Dropdown Pilihan) ---
const fetchCategoriesList = async () => {
  try {
    const response = await axios.get(categoriesUrl, { params: { entries: 100 } })
    categoriesList.value = response.data.data.data || response.data.data
  } catch (error) {
    console.error('Gagal load daftar kategori untuk dropdown', error)
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
    asset_category_id: '',
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
  fetchTypes()
  fetchCategoriesList() // Mengisi list dropdown kategori saat render
})

const handleSubmit = () => {
  submit(fetchTypes)
}

const handleDelete = () => {
  confirmDelete(fetchTypes)
}
</script>

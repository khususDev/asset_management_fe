<template>
  <div class="mx-auto max-w-screen-2xl">
    <Breadcrumb pageTitle="Asset Status" :crumbs="['Administration', 'Asset Master', 'Status']" />

    <DataTable
      :headers="['Code', 'Status Name', 'Color Badge', 'Description', 'Active', 'Action']"
      :from="statusesData.from"
      :to="statusesData.to"
      :total="statusesData.total"
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
          Tambah Status
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="6" />

      <tr
        v-else
        v-for="status in statusesData.data"
        :key="status.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center font-medium text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ status.code }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ status.name }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          <div class="flex items-center justify-center gap-2">
            <span
              v-if="status.color && status.color.startsWith('#')"
              :style="{ backgroundColor: status.color }"
              class="w-4 h-4 rounded-full border shadow-sm"
            ></span>
            <span>{{ status.color || '-' }}</span>
          </div>
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-gray-500 dark:text-gray-400 truncate max-w-[250px] last:border-r-0 dark:border-strokedark"
        >
          {{ status.description || '-' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <StatusBadge :active="status.is_active" />
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <TableAction @edit="openEdit(status)" @delete="openDelete(status.id)" />
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!statusesData.data || statusesData.data.length === 0)"
        :colspan="6"
      />

      <template #pagination>
        <Pagination :links="statusesData.links" @change-page="fetchStatuses" />
      </template>
    </DataTable>

    <Modal :show="showModal" :title="isEdit ? 'Edit Status' : 'Tambah Status'" @close="closeModal">
      <div class="p-6 flex flex-col gap-4">
        <FormInput
          label="Status Code"
          v-model="form.code"
          format="uppercase"
          :disabled="isEdit"
          :error="errors?.code ? errors.code[0] : null"
          placeholder="e.g., ACT, BRK, MNT"
        />

        <FormInput
          label="Status Name"
          v-model="form.name"
          format="title"
          :error="errors?.name ? errors.name[0] : null"
          placeholder="e.g., Active, Broken, In Maintenance"
        />

        <div class="flex gap-4">
          <div class="w-full">
            <FormInput
              label="Color Code (Opsional)"
              v-model="form.color"
              :error="errors?.color ? errors.color[0] : null"
              placeholder="e.g., #10B981, success, danger"
            />
          </div>
          <div class="pt-8">
            <input
              type="color"
              v-model="form.color"
              class="w-10 h-10 p-0 border-0 rounded cursor-pointer overflow-hidden"
            />
          </div>
        </div>

        <div>
          <label class="mb-2.5 block text-sm font-medium text-black dark:text-white"
            >Description</label
          >
          <textarea
            v-model="form.description"
            rows="3"
            format="capitalize"
            placeholder="Keterangan status..."
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
import axios from 'axios' // pastikan import axios yang benar

import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import DataTable from '@/Components/Table/DataTable.vue'
import Pagination from '@/Components/Table/Pagination.vue'
import TableAction from '@/Components/Table/TableAction.vue'
import TableEmpty from '@/Components/Table/TableEmpty.vue'
import TableLoading from '@/Components/Table/TableLoading.vue'
import FormInput from '@/Components/Form/FormInput.vue'
import FormCheckbox from '@/Components/Form/FormCheckbox.vue'
import Modal from '@/Components/Modal/Modal.vue'
import ConfirmModal from '@/Components/Modal/ConfirmModal.vue'
import StatusBadge from '@/Components/Badge/StatusBadge.vue'

import useCrud from '@/Composables/useCrud'
import useTable from '@/Composables/useTable'

// --- STATE MANAGEMENT ---
const statusesData = ref({})
const isFetching = ref(false)

const apiUrl = API_ENDPOINTS.asmStatus

// --- SETUP TABLE ---
const { search, entries } = useTable(
  {
    search: '',
    entries: 10,
  },
  () => fetchStatuses(),
)

// --- FETCH DATA STATUSES ---
const fetchStatuses = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
    })
    statusesData.value = response.data.data
  } catch (error) {
    console.error('Gagal load data asset statuses', error)
  } finally {
    isFetching.value = false
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
    code: '',
    name: '',
    color: '#10B981', // Default warna hijau success
    description: '',
    is_active: true,
  },
  storeRoute: apiUrl,
  updateRoute: apiUrl,
  deleteRoute: apiUrl,
})

// --- LIFECYCLE ---
onMounted(() => {
  fetchStatuses()
})

const handleSubmit = () => {
  submit(fetchStatuses)
}

const handleDelete = () => {
  confirmDelete(fetchStatuses)
}
</script>

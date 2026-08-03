<template>
  <div class="mx-auto max-w-screen-2xl">
    <PageTitle title="Master License Metrics" />

    <DataTable
      :headers="['Code', 'Metric Name', 'Description', 'Status', 'Action']"
      :from="licenseMetricsData.from"
      :to="licenseMetricsData.to"
      :total="licenseMetricsData.total"
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
          Tambah Metrik
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="5" />

      <tr
        v-else
        v-for="metric in licenseMetricsData.data"
        :key="metric.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center font-medium text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ metric.code }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ metric.name }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-gray-500 dark:text-gray-400 truncate max-w-[300px] last:border-r-0 dark:border-strokedark"
        >
          {{ metric.description || '-' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <StatusBadge :active="metric.is_active" />
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <TableAction show-edit-delete @edit="openEdit(metric)" @delete="openDelete(metric.id)" />
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!licenseMetricsData.data || licenseMetricsData.data.length === 0)"
        :colspan="5"
      />

      <template #pagination>
        <Pagination :links="licenseMetricsData.links" @change-page="fetchLicenseMetrics" />
      </template>
    </DataTable>

    <Modal
      :show="showModal"
      :title="isEdit ? 'Edit Metrik Lisensi' : 'Tambah Metrik Lisensi'"
      @close="closeModal"
    >
      <div class="p-6 flex flex-col gap-4">
        <FormInput
          label="License Metric Code"
          v-model="form.code"
          format="uppercase"
          :disabled="isEdit"
          :error="errors?.code ? errors.code[0] : null"
          placeholder="e.g., USR, DEV, CORE"
        />

        <FormInput
          label="License Metric Name"
          v-model="form.name"
          format="title"
          :error="errors?.name ? errors.name[0] : null"
          placeholder="e.g., Per User, Per Device, Core-based"
        />

        <div>
          <label class="mb-2.5 block text-sm font-medium text-black dark:text-white"
            >Description</label
          >
          <textarea
            v-model="form.description"
            rows="3"
            format="capitalize"
            placeholder="Penjelasan aturan perhitungan lisensi..."
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

import { ref, onMounted } from 'vue'
import axios from 'axios'
import PageTitle from '@/Components/common/PageTitle.vue'
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
const licenseMetricsData = ref({})
const isFetching = ref(false)

const apiUrl = API_ENDPOINTS.lcsMetric

// --- SETUP TABLE ---
const { search, entries } = useTable(
  {
    search: '',
    entries: 10,
  },
  () => fetchLicenseMetrics(),
)

// --- FETCH DATA ---
const fetchLicenseMetrics = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
    })
    licenseMetricsData.value = response.data.data
  } catch (error) {
    console.error('Gagal load data license metrics', error)
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
    description: '',
    is_active: true,
  },
  storeRoute: apiUrl,
  updateRoute: apiUrl,
  deleteRoute: apiUrl,
})

// --- LIFECYCLE ---
onMounted(() => {
  fetchLicenseMetrics()
})

const handleSubmit = () => {
  submit(fetchLicenseMetrics)
}

const handleDelete = () => {
  confirmDelete(fetchLicenseMetrics)
}
</script>

<template>
  <div class="mx-auto max-w-screen-2xl">
    <PageTitle title="Master Cost Centers" />

    <DataTable
      :headers="['Code', 'Cost Center Name', 'Description', 'Status', 'Action']"
      :from="costCentersData.from"
      :to="costCentersData.to"
      :total="costCentersData.total"
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
          Tambah Cost Center
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="5" />

      <tr
        v-else
        v-for="costcenter in costCentersData.data"
        :key="costcenter.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center font-medium text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ costcenter.code }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ costcenter.name }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-gray-500 dark:text-gray-400 truncate max-w-[300px] last:border-r-0 dark:border-strokedark"
        >
          {{ costcenter.description || '-' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <StatusBadge :active="costcenter.is_active" />
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <TableAction
            show-edit-delete
            @edit="openEdit(costcenter)"
            @delete="openDelete(costcenter.id)"
          />
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!costCentersData.data || costCentersData.data.length === 0)"
        :colspan="5"
      />

      <template #pagination>
        <Pagination :links="costCentersData.links" @change-page="fetchCostCenters" />
      </template>
    </DataTable>

    <Modal
      :show="showModal"
      :title="isEdit ? 'Edit Cost Center' : 'Tambah Cost Center'"
      @close="closeModal"
    >
      <div class="p-6 flex flex-col gap-4">
        <FormInput
          label="Cost Center Code"
          v-model="form.code"
          format="uppercase"
          :disabled="isEdit"
          :error="errors?.code ? errors.code[0] : null"
          placeholder="e.g., CC-IT-01, CC-FIN-01"
        />

        <FormInput
          label="Cost Center Name"
          v-model="form.name"
          format="title"
          :error="errors?.name ? errors.name[0] : null"
          placeholder="e.g., IT Operations, Finance Dept"
        />

        <div>
          <label class="mb-2.5 block text-sm font-medium text-black dark:text-white"
            >Description</label
          >
          <textarea
            v-model="form.description"
            rows="3"
            format="capitalize"
            placeholder="Cost center details or scope..."
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
const costCentersData = ref({})
const isFetching = ref(false)

const apiUrl = API_ENDPOINTS.orgCostcenter

// --- SETUP TABLE ---
const { search, entries } = useTable(
  {
    search: '',
    entries: 10,
  },
  () => fetchCostCenters(),
)

// --- FETCH DATA COST CENTERS ---
const fetchCostCenters = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
    })
    costCentersData.value = response.data.data
  } catch (error) {
    console.error('Gagal load data cost centers', error)
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
  fetchCostCenters()
})

const handleSubmit = () => {
  submit(fetchCostCenters)
}

const handleDelete = () => {
  confirmDelete(fetchCostCenters)
}
</script>

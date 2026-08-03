<template>
  <div class="mx-auto max-w-screen-2xl">
    <PageTitle title="Master Branchs" />

    <DataTable
      :headers="['Code', 'Branch Name', 'Phone', 'Address', 'Status', 'Action']"
      :from="branchesData.from"
      :to="branchesData.to"
      :total="branchesData.total"
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
          Tambah Branch
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="6" />

      <tr
        v-else
        v-for="branch in branchesData.data"
        :key="branch.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center font-medium text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ branch.code }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ branch.name }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ branch.phone || '-' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-gray-500 dark:text-gray-400 truncate max-w-[200px] last:border-r-0 dark:border-strokedark"
        >
          {{ branch.address || '-' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <StatusBadge :active="branch.is_active" />
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <TableAction show-edit-delete @edit="openEdit(branch)" @delete="openDelete(branch.id)" />
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!branchesData.data || branchesData.data.length === 0)"
        :colspan="6"
      />

      <template #pagination>
        <Pagination :links="branchesData.links" @change-page="fetchBranches" />
      </template>
    </DataTable>

    <Modal :show="showModal" :title="isEdit ? 'Edit Branch' : 'Tambah Branch'" @close="closeModal">
      <div class="p-6 flex flex-col gap-4">
        <FormInput
          label="Branch Code"
          v-model="form.code"
          format="uppercase"
          :disabled="isEdit"
          :error="errors?.code ? errors.code[0] : null"
          placeholder="e.g., JKT-01"
        />

        <FormInput
          label="Branch Name"
          v-model="form.name"
          format="title"
          :error="errors?.name ? errors.name[0] : null"
          placeholder="e.g., Kantor Pusat Jakarta"
        />

        <FormInput
          label="Phone Number"
          v-model="form.phone"
          format="number"
          :error="errors?.phone ? errors.phone[0] : null"
          placeholder="e.g., 021-888999"
        />

        <div>
          <label class="mb-2.5 block text-sm font-medium text-black dark:text-white">Address</label>
          <textarea
            v-model="form.address"
            rows="3"
            format="capitalize"
            placeholder="Complete address..."
            class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            :class="{ 'border-danger focus:border-danger': errors?.address }"
          ></textarea>
          <p v-if="errors?.address" class="mt-1 text-xs text-danger">{{ errors.address[0] }}</p>
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
import Modal from '@/Components/Modal/Modal.vue'
import ConfirmModal from '@/Components/Modal/ConfirmModal.vue'
import StatusBadge from '@/Components/Badge/StatusBadge.vue'

import useCrud from '@/Composables/useCrud'
import useTable from '@/Composables/useTable'

// --- STATE MANAGEMENT ---
const branchesData = ref({})
const isFetching = ref(false)

// URL API disesuaikan dengan endpoint resource API yang kita buat sebelumnya di routes/api.php
const apiUrl = API_ENDPOINTS.orgBranch

// --- SETUP TABLE ---
const { search, entries } = useTable(
  {
    search: '',
    entries: 10,
  },
  () => fetchBranches(),
)

// --- FETCH DATA BRANCHES ---
const fetchBranches = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
    })
    branchesData.value = response.data.data
  } catch (error) {
    console.error('Gagal load data branches', error)
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
    phone: '',
    address: '',
    is_active: true,
  },
  storeRoute: apiUrl,
  updateRoute: apiUrl,
  deleteRoute: apiUrl,
})

// --- LIFECYCLE ---
onMounted(() => {
  fetchBranches()
})

const handleSubmit = () => {
  submit(fetchBranches)
}

const handleDelete = () => {
  confirmDelete(fetchBranches)
}
</script>

<template>
  <div class="mx-auto max-w-screen-2xl">
    <Breadcrumb pageTitle="Approval Settings" :crumbs="['Administration', 'System Settings']" />

    <DataTable
      :headers="['Module', 'Department', 'Total Level', 'Status', 'Action']"
      :from="approvalsData.from"
      :to="approvalsData.to"
      :total="approvalsData.total"
      :search="search"
      :entries="entries"
      @search="search = $event"
      @update:entries="entries = $event"
    >
      <template #top-actions>
        <button
          @click="openCreateCustom"
          class="rounded bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
        >
          Tambah Aturan
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="5" />

      <tr
        v-else
        v-for="item in approvalsData.data"
        :key="item.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 font-medium text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ item.module }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ item.department }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center font-bold text-primary last:border-r-0 dark:border-strokedark"
        >
          {{ item.levels?.length || 0 }} Tingkat
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <StatusBadge :active="item.is_active" />
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <TableAction @edit="openEditCustom(item)" @delete="openDelete(item.id)" />
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!approvalsData.data || approvalsData.data.length === 0)"
        :colspan="5"
      />

      <template #pagination>
        <Pagination :links="approvalsData.links" @change-page="fetchApprovals" />
      </template>
    </DataTable>

    <!-- MODAL CUSTOM HEADER DETAIL -->
    <Modal
      :show="showModal"
      :title="isEdit ? 'Edit Aturan Approval' : 'Tambah Aturan Approval'"
      @close="closeModal"
    >
      <div class="p-6 flex flex-col gap-6 w-[800px] max-w-full">
        <!-- Bagian HEADER -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-meta-4 p-4 rounded-lg">
          <FormInput
            label="Module Name"
            v-model="form.module"
            :error="errors?.module ? errors.module[0] : null"
            placeholder="e.g., Purchase Request"
          />
          <div>
            <label class="mb-1 block text-sm font-medium text-black dark:text-white">
              Department Target
            </label>
            <select
              v-model="form.department"
              class="w-full rounded border border-stroke bg-transparent py-2 px-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="ALL">ALL (Semua Departemen)</option>
              <option v-for="dept in departmentsList" :key="dept.id" :value="dept.name">
                {{ dept.name }}
              </option>
            </select>
            <span v-if="errors?.department" class="text-sm text-danger mt-1">{{
              errors.department[0]
            }}</span>
          </div>
        </div>

        <!-- Bagian DETAIL (LEVELS) -->
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-md font-bold text-black dark:text-white">Approval Levels</h3>
            <button
              @click="addLevel"
              class="rounded bg-success py-1 px-3 text-xs font-medium text-white hover:bg-opacity-90"
            >
              + Tambah Level
            </button>
          </div>

          <div class="flex flex-col gap-3">
            <div
              v-for="(lvl, index) in form.levels"
              :key="index"
              class="flex items-start gap-4 border border-stroke dark:border-strokedark p-3 rounded"
            >
              <div class="pt-2 font-bold text-primary w-16">Level {{ index + 1 }}</div>

              <div class="flex-1">
                <label class="mb-1 block text-sm font-medium text-black dark:text-white"
                  >Pilih User Approver</label
                >
                <select
                  v-model="lvl.user_id"
                  class="w-full rounded border border-stroke bg-transparent py-2 px-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                >
                  <option value="" disabled>-- Pilih User --</option>
                  <!-- Looping data users asli dari API Anda -->
                  <option v-for="user in usersList" :key="user.id" :value="user.id">
                    {{ user.name }} ({{ user.position || 'No Position' }})
                  </option>
                </select>
              </div>

              <div class="flex-1">
                <FormInput
                  label="Min. Amount (Rp)"
                  type="number"
                  v-model="lvl.min_amount"
                  placeholder="0 untuk selalu butuh"
                />
              </div>

              <div class="pt-7">
                <button
                  @click="removeLevel(index)"
                  class="text-danger hover:text-opacity-80 p-2"
                  title="Hapus Level"
                >
                  <svg
                    class="fill-current w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <p v-if="form.levels.length === 0" class="text-sm text-center py-4 text-gray-500">
              Belum ada level approval. Klik "Tambah Level".
            </p>
          </div>
        </div>

        <div class="border-t border-stroke dark:border-strokedark pt-4">
          <FormCheckbox label="Active Status (Keseluruhan Modul)" v-model="form.is_active" />
        </div>
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
          :disabled="loading || form.levels.length === 0"
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
import axios from '@/api/axios'

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

const formatCurrency = (value) => {
  if (!value || value == 0) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const approvalsData = ref({})
const isFetching = ref(false)

// 1. Variabel penampung data untuk Dropdown
const usersList = ref([])
const departmentsList = ref([])

const apiUrl = API_ENDPOINTS.wflApprovalSetting

const { search, entries } = useTable({ search: '', entries: 10 }, () => fetchApprovals())

const fetchApprovals = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
    })
    approvalsData.value = response.data.data
  } catch (error) {
    console.error('Gagal load data approval settings', error)
  } finally {
    isFetching.value = false
  }
}

// Fungsi Fetch Dropdown User
const fetchUsers = async () => {
  try {
    // Gunakan API_ENDPOINTS.admUsers dari endpoints.js Anda
    const response = await axios.get(API_ENDPOINTS.admUsers, {
      params: { entries: 10000 },
    })

    usersList.value = response.data?.data?.data || []
  } catch (error) {
    console.error('Gagal load users', error)
  }
}

// Fungsi Fetch Dropdown Department
const fetchDepartments = async () => {
  try {
    // Gunakan API_ENDPOINTS.orgDepartment dari endpoints.js Anda
    const response = await axios.get(API_ENDPOINTS.orgDepartment, {
      params: { entries: 10000 },
    })

    departmentsList.value = response.data?.data?.data || []
  } catch (error) {
    console.error('Gagal load departments', error)
  }
}

const defaultForm = {
  module: '',
  department: 'ALL',
  is_active: true,
  levels: [{ user_id: '', min_amount: 0 }],
}

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
  initialForm: JSON.parse(JSON.stringify(defaultForm)),
  storeRoute: apiUrl,
  updateRoute: apiUrl,
  deleteRoute: apiUrl,
})

const openCreateCustom = () => {
  form.value = JSON.parse(JSON.stringify(defaultForm))
  openCreate()
}

const openEditCustom = (item) => {
  openEdit(item)
  form.value.levels = item.levels.map((lvl) => ({
    user_id: lvl.user_id,
    min_amount: lvl.min_amount,
  }))
}

const addLevel = () => {
  form.value.levels.push({ user_id: '', min_amount: 0 })
}

const removeLevel = (index) => {
  form.value.levels.splice(index, 1)
}

// 4. Panggil semua fetch saat halaman dimuat
onMounted(() => {
  fetchApprovals()
  fetchUsers()
  fetchDepartments()
})

const handleSubmit = () => {
  submit(fetchApprovals)
}

const handleDelete = () => {
  confirmDelete(fetchApprovals)
}
</script>

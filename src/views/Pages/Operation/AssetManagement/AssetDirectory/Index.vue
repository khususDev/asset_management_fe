<template>
  <!-- Top Loading -->
  <div
    class="fixed left-0 top-0 z-[99999] h-1 bg-blue-600 transition-all duration-300"
    :class="isGlobalLoading ? 'w-full' : 'w-0'"
  ></div>

  <div class="mx-auto max-w-screen-2xl p-3 bg-gray-50 min-h-screen">
    <!-- Breadcrumb & Header -->
    <div class="mb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="mb-2">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Fixed Assets Directory</h1>
        <!-- Garis Aksen Biru Pendek -->
        <div class="h-1 w-16 bg-blue-600 rounded-full mt-2"></div>
      </div>
      <div>
        <button
          @click="fetchAssets()"
          class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition"
        >
          <svg
            class="w-4 h-4 mr-2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh Data
        </button>
      </div>
    </div>

    <!-- 1. Statistic Tracker Cards (Desain Selaras License & Consumable) -->
    <div class="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Total Asset -->
      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div class="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Asset</p>
          <p class="text-2xl font-bold text-gray-900">{{ statistics.total }}</p>
        </div>
      </div>

      <!-- Available -->
      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div class="p-3 rounded-lg bg-emerald-50 text-emerald-600 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Available</p>
          <p class="text-2xl font-bold text-emerald-600">{{ statistics.available }}</p>
        </div>
      </div>

      <!-- Assigned -->
      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div class="p-3 rounded-lg bg-indigo-50 text-indigo-600 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Assigned</p>
          <p class="text-2xl font-bold text-indigo-600">{{ statistics.assigned }}</p>
        </div>
      </div>

      <!-- Maintenance -->
      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div class="p-3 rounded-lg bg-amber-50 text-amber-600 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Maintenance</p>
          <p class="text-2xl font-bold text-amber-600">{{ statistics.maintenance }}</p>
        </div>
      </div>

      <!-- Disposed -->
      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div class="p-3 rounded-lg bg-rose-50 text-rose-600 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Disposed</p>
          <p class="text-2xl font-bold text-rose-600">{{ statistics.disposed }}</p>
        </div>
      </div>
    </div>

    <!-- 2. Data Table Wrapper -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4">
      <DataTable
        :headers="[
          '',
          'Asset Code',
          'Asset Name',
          'Category',
          'Type',
          'Branch',
          'Location',
          'Usage',
          'Asset Status',
          'Action',
        ]"
        :from="table.from"
        :to="table.to"
        :total="table.total"
        :search="search"
        :entries="entries"
        @search="search = $event"
        @update:entries="entries = $event"
      >
        <!-- Top Actions (Export Excel & Print Label) -->
        <template #top-actions>
          <div class="flex items-center gap-3">
            <button
              class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
              @click="exportExcel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 16V4m0 12l-4-4m4 4l4-4M4 20h16"
                />
              </svg>
              Export Excel
            </button>

            <button
              class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
              @click="openPrintLabelModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 9V2h12v7M6 18H5a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-1M6 14h12v8H6v-8z"
                />
              </svg>
              Print Label
            </button>
          </div>
        </template>

        <!-- Right Actions (Filters) -->
        <template #right-actions>
          <div class="flex items-center gap-3">
            <select
              v-model="filters.category"
              class="py-2 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>

            <select
              v-model="filters.usage"
              class="py-2 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Usage</option>
              <option
                v-for="usage in usageStatuses"
                :key="usage.code || usage.value || usage.id"
                :value="usage.code || usage.value || usage.id"
              >
                {{ usage.name || usage.label }}
              </option>
            </select>
          </div>
        </template>

        <!-- Table Loading -->
        <TableLoading v-if="isFetching" :rows="8" :cols="10" />

        <!-- Table Rows -->
        <tr
          v-else
          v-for="item in table.data"
          :key="item.id"
          class="border-b border-gray-200 hover:bg-gray-50/80 transition-colors"
        >
          <td class="px-4 py-4 text-center">
            <input
              type="checkbox"
              :value="item.id"
              v-model="selectedIds"
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </td>
          <td class="px-4 py-4 font-mono font-medium text-blue-600">
            {{ item.asset.code }}
          </td>

          <td class="max-w-md truncate px-4 py-4" :title="item.asset.name">
            <div class="text-xs text-bold font-mono">
              {{ item.asset.name }}
              {{ item.asset.serial_number || '-' }}
            </div>
          </td>

          <td class="px-4 py-4 text-gray-700">
            {{ item.category?.name || '-' }}
          </td>

          <td class="px-4 py-4 text-gray-700">
            {{ item.type?.name || '-' }}
          </td>

          <td class="px-4 py-4 text-gray-700 font-medium">
            {{ item.branch?.code || '-' }}
          </td>

          <td class="px-4 py-4 text-gray-700">
            {{ item.location?.name || '-' }}
          </td>

          <td class="px-4 py-4 text-center">
            <UsageStatusBadge :usage="item.usage" />
          </td>

          <td class="px-4 py-4 text-center">
            <StatusBadge :status="item.status" />
          </td>

          <td class="px-4 py-4 text-center">
            <TableAction
              show-view
              show-assign
              @view="openDetail(item.id)"
              @assign="handleOpenAssignModal(item)"
            />
          </td>
        </tr>

        <!-- Table Empty -->
        <TableEmpty v-if="!isFetching && table.data.length === 0" :colspan="10" />

        <!-- Pagination -->
        <template #pagination>
          <Pagination :links="table.links" @change-page="fetchAssets" />
        </template>
      </DataTable>
    </div>

    <AssignAssetModal
      :show="showAssignModal"
      :asset="selectedAsset"
      :users="userList"
      :departments="departmentList"
      :locations="locationList"
      :loading="isSubmittingAssign"
      :errors="assignErrors"
      @close="showAssignModal = false"
      @submit="submitAssignAsset"
    />

    <!-- Modals -->
    <DetailAssetModal
      :show="showDetailModal"
      :asset="selectedAsset"
      @close="showDetailModal = false"
    />

    <PrintLabelModal
      :show="showPrintLabelModal"
      :selected-count="selectedIds.length"
      :total-filtered="table.total"
      @close="showPrintLabelModal = false"
      @print="printLabels"
    />
  </div>
</template>

<script setup>
import { API_ENDPOINTS } from '@/api/endpoints'
import axios from 'axios'
import { ref, onMounted, watch } from 'vue'
import DataTable from '@/Components/Table/DataTable.vue'
import Pagination from '@/Components/Table/Pagination.vue'
import TableAction from '@/Components/Table/TableAction.vue'
import TableLoading from '@/Components/Table/TableLoading.vue'
import TableEmpty from '@/Components/Table/TableEmpty.vue'
import StatusBadge from '@/components/Badge/StatusBadge.vue'
import UsageStatusBadge from '@/components/Badge/UsageStatusBadge.vue'
import useTable from '@/Composables/useTable'
import DetailAssetModal from './components/DetailAssetModal.vue'
import PrintLabelModal from './components/PrintLabelModal.vue'
import AssignAssetModal from './components/AssignAssetModal.vue'

const isGlobalLoading = ref(false)
const isFetching = ref(false)
const showDetailModal = ref(false)

const apiUrl = API_ENDPOINTS.optAssetDirectory
const apiMasters = API_ENDPOINTS.optAssetDirectoryMasters
const apiAssign = API_ENDPOINTS.optAssetAssignment

const showPrintLabelModal = ref(false)
const selectedIds = ref([])
const selectAll = ref(false)

// State Assignment Modal
const showAssignModal = ref(false)
const selectedAsset = ref(null)
const isSubmittingAssign = ref(false)
const assignErrors = ref({})

// Data Dropdowns
const userList = ref([])
const departmentList = ref([])
const locationList = ref([])

// Handler Buka Modal
const handleOpenAssignModal = (asset) => {
  selectedAsset.value = asset
  assignErrors.value = {}
  showAssignModal.value = true
}

// 🛠️ PERBAIKAN: Handler Submit ke API Laravel
const submitAssignAsset = async (formData) => {
  isSubmittingAssign.value = true
  assignErrors.value = {}

  try {
    const token = localStorage.getItem('token')

    // Menggunakan variabel apiAssign + asset_id + /assign dan Authorization Header
    await axios.post(`${apiAssign}/${formData.asset_id}/assign`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    showAssignModal.value = false
    fetchAssets() // Refresh data tabel aset
  } catch (error) {
    if (error.response && error.response.status === 422) {
      // Error validasi form (misal: field wajib diisi)
      assignErrors.value = error.response.data.errors
    } else {
      // Error server (500, Database, Route, dll)
      const errorMessage =
        error.response?.data?.message || 'Terjadi kesalahan sistem saat memproses assignment.'

      // 🛠️ Tampilkan feedback ke UI (Ganti dengan Toast library proyek Anda jika ada)
      alert(errorMessage)

      console.error('Gagal assign aset:', error)
    }
  } finally {
    isSubmittingAssign.value = false
  }
}

const table = ref({
  data: [],
  links: [],
  from: 0,
  to: 0,
  total: 0,
})

const statistics = ref({
  total: 0,
  available: 0,
  assigned: 0,
  maintenance: 0,
  disposed: 0,
})

const { search, entries } = useTable(
  {
    search: '',
    entries: 10,
  },
  () => fetchAssets(),
)

const exportExcel = () => {
  // next step
}

const openPrintLabelModal = () => {
  showPrintLabelModal.value = true
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedIds.value = table.value.data.map((item) => item.id)
  } else {
    selectedIds.value = []
  }
}

const printLabels = async (payload) => {
  try {
    const token = localStorage.getItem('token')

    const requestData = {
      paper_size: payload.paper_size,
      category: filters.value.category,
      usage: filters.value.usage,
      search: search.value,
      selected_ids: payload.print_scope === 'SELECTED' ? selectedIds.value : [],
    }

    const response = await axios.post(`${apiUrl}/print-label`, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    })

    const file = new Blob([response.data], { type: 'application/pdf' })
    const fileURL = URL.createObjectURL(file)
    window.open(fileURL, '_blank')

    showPrintLabelModal.value = false
  } catch (error) {
    console.error('Gagal mencetak label:', error)
  }
}

const categories = ref([])
const types = ref([])
const brands = ref([])
const statuses = ref([])
const branches = ref([])
const locations = ref([])
const vendors = ref([])
const usageStatuses = ref([])

const filters = ref({
  category: '',
  usage: '',
})

const fetchMasters = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(apiMasters, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const masterData = response.data.data

    categories.value = masterData.categories
    types.value = masterData.types
    brands.value = masterData.brands
    statuses.value = masterData.statuses
    branches.value = masterData.branches
    locations.value = masterData.locations
    vendors.value = masterData.vendors
    usageStatuses.value = masterData.usage_statuses

    // Pemataan data dropdown untuk modal assignment
    userList.value = masterData.users || []
    departmentList.value = masterData.departments || []
    locationList.value = masterData.locations || []
  } catch (error) {
    console.error(error)
  }
}

const fetchAssets = async (url = apiUrl) => {
  isFetching.value = true

  try {
    const token = localStorage.getItem('token')

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search: search.value,
        entries: entries.value,

        category: filters.value.category,
        usage: filters.value.usage,
      },
    })

    statistics.value = response.data.statistics

    table.value = {
      data: response.data.data || [],
      links: response.data.links || [],
      from: response.data.from || 0,
      to: response.data.to || 0,
      total: response.data.total || 0,
    }

    selectedIds.value = []
    selectAll.value = false
  } catch (error) {
    console.error(error)
  } finally {
    isFetching.value = false
  }
}

const openDetail = async (id) => {
  isGlobalLoading.value = true

  try {
    const token = localStorage.getItem('token')

    const response = await axios.get(`${apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    selectedAsset.value = response.data.data

    showDetailModal.value = true
  } catch (error) {
    console.error(error)
  } finally {
    isGlobalLoading.value = false
  }
}

watch(selectedIds, () => {
  selectAll.value =
    table.value.data.length > 0 && selectedIds.value.length === table.value.data.length
})

watch(
  filters,
  () => {
    fetchAssets()
  },
  {
    deep: true,
  },
)

onMounted(async () => {
  await Promise.all([fetchAssets(), fetchMasters()])
})
</script>

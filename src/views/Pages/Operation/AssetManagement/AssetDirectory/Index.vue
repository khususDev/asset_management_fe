<template>
  <!-- Top Loading -->
  <div
    class="fixed left-0 top-0 z-[99999] h-1 bg-primary transition-all duration-300"
    :class="isGlobalLoading ? 'w-full' : 'w-0'"
  ></div>

  <div class="mx-auto max-w-screen-2xl">
    <Breadcrumb pageTitle="Asset Directory" :crumbs="['Operations', 'Asset Management']" />

    <!-- Statistic -->
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
      <div class="rounded-lg border bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Total Asset</p>
        <h2 class="mt-2 text-3xl font-bold">
          {{ statistics.total }}
        </h2>
      </div>

      <div class="rounded-lg border bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Available</p>
        <h2 class="mt-2 text-3xl font-bold text-success">
          {{ statistics.available }}
        </h2>
      </div>

      <div class="rounded-lg border bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Assigned</p>
        <h2 class="mt-2 text-3xl font-bold text-primary">
          {{ statistics.assigned }}
        </h2>
      </div>

      <div class="rounded-lg border bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Maintenance</p>
        <h2 class="mt-2 text-3xl font-bold text-warning">
          {{ statistics.maintenance }}
        </h2>
      </div>

      <div class="rounded-lg border bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Disposed</p>
        <h2 class="mt-2 text-3xl font-bold text-danger">
          {{ statistics.disposed }}
        </h2>
      </div>
    </div>

    <DataTable
      :headers="[
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
      <template #top-actions>
        <div class="flex items-center gap-3">
          <button
            class="inline-flex items-center gap-2 rounded-lg border border-success bg-success px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-success/90"
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
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
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
      <!-- FILTER -->
      <template #right-actions>
        <div class="flex items-center gap-3">
          <select
            v-model="filters.category"
            class="rounded border border-stroke bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">All Category</option>

            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>

          <select
            v-model="filters.usage"
            class="rounded border border-stroke bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">All Usage</option>

            <option v-for="usage in usageStatuses" :key="usage.code" :value="usage.code">
              {{ usage.name }}
            </option>
          </select>
        </div>
      </template>

      <TableLoading v-if="isFetching" :rows="8" :cols="9" />

      <tr
        v-else
        v-for="item in table.data"
        :key="item.id"
        class="border-b border-stroke hover:bg-gray-50"
      >
        <td class="border-r px-4 py-4 font-semibold text-primary">
          {{ item.asset.code }}
        </td>

        <td class="border-r px-4 py-4">
          <div class="font-semibold">
            {{ item.asset.name }}
          </div>

          <div class="text-xs text-gray-500">
            {{ item.asset.serial_number || '-' }}
          </div>
        </td>

        <td class="border-r px-4 py-4">
          {{ item.category?.name || '-' }}
        </td>

        <td class="border-r px-4 py-4">
          {{ item.type?.name || '-' }}
        </td>

        <td class="border-r px-4 py-4">{{ item.branch?.code || '-' }}</td>

        <td class="border-r px-4 py-4">
          {{ item.location?.name || '-' }}
        </td>

        <td class="border-r px-4 py-4 text-center">
          <UsageStatusBadge :usage="item.usage" />
        </td>

        <td class="border-r px-4 py-4 text-center">
          <StatusBadge :status="item.status" />
        </td>

        <td class="px-4 py-4 text-center">
          <TableAction show-view @view="openDetail(item.id)" />
        </td>
      </tr>

      <TableEmpty v-if="!isFetching && table.data.length === 0" :colspan="9" />

      <template #pagination>
        <Pagination :links="table.links" @change-page="fetchAssets" />
      </template>
    </DataTable>

    <DetailAssetModal
      :show="showDetailModal"
      :asset="selectedAsset"
      @close="showDetailModal = false"
    />

    <PrintLabelModal
      :show="showPrintLabelModal"
      @close="showPrintLabelModal = false"
      @print="printLabels"
    />
  </div>
</template>

<script setup>
import { API_ENDPOINTS } from '@/api/endpoints'
import axios from 'axios'
import { ref, onMounted, watch } from 'vue'
import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import DataTable from '@/Components/Table/DataTable.vue'
import Pagination from '@/Components/Table/Pagination.vue'
import TableAction from '@/Components/Table/TableAction.vue'
import TableLoading from '@/Components/Table/TableLoading.vue'
import TableEmpty from '@/Components/Table/TableEmpty.vue'
import StatusBadge from '@/components/Badge/StatusBadge.vue'
import UsageStatusBadge from '@/components/Badge/UsageStatusBadge.vue'
import useTable from '@/Composables/useTable'
import DetailAssetModal from './components/DetailAssetModal.vue'
import PrintLabelModal from '../../components/PrintLabelModal.vue'

const isGlobalLoading = ref(false)
const isFetching = ref(false)
const showDetailModal = ref(false)
const selectedAsset = ref(null)

const apiUrl = API_ENDPOINTS.optAssetDirectory
const apiMasters = API_ENDPOINTS.optAssetDirectoryMasters

const showPrintLabelModal = ref(false)
const selectedIds = ref([])
const selectAll = ref(false)

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

    const response = await axios.post(
      `${apiUrl}/print-label`,
      {
        ...payload,

        category: filters.value.category,
        usage: filters.value.usage,

        search: search.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        responseType: 'blob',
      },
    )

    const file = new Blob([response.data], {
      type: 'application/pdf',
    })

    const url = window.URL.createObjectURL(file)

    window.open(url)

    showPrintLabelModal.value = false
  } catch (error) {
    console.error(error)
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    categories.value = response.data.data.categories
    types.value = response.data.data.types
    brands.value = response.data.data.brands
    statuses.value = response.data.data.statuses
    branches.value = response.data.data.branches
    locations.value = response.data.data.locations
    vendors.value = response.data.data.vendors
    usageStatuses.value = response.data.data.usage_statuses
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

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
        'Asset Status',
        'Usage',
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
        <button
          class="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
          @click="fetchAssets()"
        >
          Refresh
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="9" />

      <tr
        v-else
        v-for="item in table.data || []"
        :key="item.id"
        class="border-b border-stroke hover:bg-gray-50"
      >
        <td class="border-r px-4 py-4 font-semibold text-primary">
          {{ item.asset.code }}
        </td>

        <td class="border-r px-4 py-4 text-left">
          <div class="font-semibold">
            {{ item.asset.name }}
          </div>

          <div class="text-xs text-gray-500">
            {{ item.asset.serial_number || '-' }}
          </div>
        </td>

        <td class="border-r px-4 py-4">
          {{ item.category?.name }}
        </td>

        <td class="border-r px-4 py-4">
          {{ item.type?.name }}
        </td>

        <td class="border-r px-4 py-4">
          {{ item.branch?.name }}
        </td>

        <td class="border-r px-4 py-4">
          {{ item.location?.name ?? '-' }}
        </td>

        <td class="border-r px-4 py-4">
          <span
            class="rounded px-2 py-1 text-xs font-semibold text-white"
            :style="{ background: item.status.color }"
          >
            {{ item.status.name }}
          </span>
        </td>

        <td class="border-r px-4 py-4">
          <span
            class="rounded px-2 py-1 text-xs font-semibold"
            :class="{
              'bg-success/20 text-success': item.usage.code == 'AVAILABLE',

              'bg-primary/20 text-primary': item.usage.code == 'ASSIGNED',

              'bg-warning/20 text-warning': item.usage.code == 'MAINTENANCE',

              'bg-danger/20 text-danger': item.usage.code == 'DISPOSED',
            }"
          >
            {{ item.usage.label }}
          </span>
        </td>

        <td class="px-4 py-4">
          <TableAction show-view @view="openDetail(item.id)" />
        </td>
      </tr>

      <TableEmpty v-if="!isFetching && table.data?.length === 0" :colspan="9" />

      <template #pagination>
        <Pagination :links="table.links" @change-page="fetchAssets" />
      </template>
    </DataTable>

    <DetailAssetModal
      :show="showDetailModal"
      :asset="selectedAsset"
      @close="showDetailModal = false"
    />
  </div>
</template>

<script setup>
import { API_ENDPOINTS } from '@/api/endpoints'

import axios from 'axios'
import { ref, onMounted } from 'vue'

import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import DataTable from '@/Components/Table/DataTable.vue'
import Pagination from '@/Components/Table/Pagination.vue'
import TableAction from '@/Components/Table/TableAction.vue'
import TableLoading from '@/Components/Table/TableLoading.vue'
import TableEmpty from '@/Components/Table/TableEmpty.vue'

import useTable from '@/Composables/useTable'

import DetailAssetModal from './components/DetailAssetModal.vue'

const isGlobalLoading = ref(false)
const isFetching = ref(false)

const showDetailModal = ref(false)
const selectedAsset = ref(null)

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

const fetchAssets = async (url = API_ENDPOINTS.optAssetDirectory) => {
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
      },
    })

    statistics.value = response.data.statistics

    // PERBAIKAN DI SINI:
    // Masukkan data sesuai dengan struktur objek awal
    table.value = {
      data: response.data.data || [],
      links: response.data.links || [],
      from: response.data.from || 0,
      to: response.data.to || 0,
      total: response.data.total || 0,
    }
  } catch (error) {
    console.error(error)
  } finally {
    isFetching.value = false
  }
}

// Ganti openDetail()

const openDetail = async (id) => {
  isGlobalLoading.value = true

  try {
    const token = localStorage.getItem('token')

    const response = await axios.get(`${API_ENDPOINTS.optAssetDirectory}/${id}`, {
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

onMounted(() => {
  fetchAssets()
})
</script>

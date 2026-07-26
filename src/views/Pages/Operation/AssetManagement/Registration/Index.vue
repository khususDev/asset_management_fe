<template>
  <div class="mx-auto max-w-screen-2xl">
    <Breadcrumb pageTitle="Asset Registration" :crumbs="['Operations', 'Asset Management']" />

    <DataTable
      :headers="['Asset', 'Class', 'Department', 'Vendor', 'Purchase', 'Status', 'Action']"
      :from="assets.from"
      :to="assets.to"
      :total="assets.total"
      :search="search"
      :entries="entries"
      @search="search = $event"
      @update:entries="entries = $event"
    >
      <TableLoading v-if="loading" :rows="5" :cols="7" />

      <tr v-else v-for="item in assets.data" :key="item.id">
        <td class="px-4 py-4 text-left">
          <div class="font-semibold">
            {{ item.asset.name }}
          </div>

          <div class="text-xs text-gray-500">
            {{ item.document.gr_number }}
          </div>
        </td>

        <td class="text-center">
          {{ item.asset.class }}
        </td>

        <td class="text-center">
          {{ item.department.name ?? '-' }}
        </td>

        <td class="text-center">
          {{ item.vendor.name ?? '-' }}
        </td>

        <td class="text-center">
          <div>{{ item.document.po_number }}</div>

          <div class="text-xs text-gray-500">
            {{ item.document.pr_number }}
          </div>
        </td>

        <td class="text-center">
          <span
            class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
            :class="{
              'bg-warning/20 text-warning': item.asset.status == 'WAITING_REGISTRATION',

              'bg-success/20 text-success': item.asset.status == 'REGISTERED',
            }"
          >
            {{ item.asset.status }}
          </span>
        </td>

        <td class="text-center">
          <button
            class="rounded bg-primary px-3 py-1 text-white hover:bg-opacity-90"
            @click="
              $router.push({
                name: 'opt_asset_registration.create',
                params: {
                  id: item.id,
                },
              })
            "
          >
            Register
          </button>
        </td>
      </tr>

      <TableEmpty v-if="!loading && (!assets.data || assets.data.length === 0)" :colspan="7" />

      <template #pagination>
        <Pagination :links="assets.links" @change-page="fetchAssets" />
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

import { API_ENDPOINTS } from '@/api/endpoints'
import useTable from '@/Composables/useTable'

import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import DataTable from '@/Components/Table/DataTable.vue'
import Pagination from '@/Components/Table/Pagination.vue'
import TableLoading from '@/Components/Table/TableLoading.vue'
import TableEmpty from '@/Components/Table/TableEmpty.vue'

const assets = ref({
  data: [],
  from: 0,
  to: 0,
  total: 0,
  links: [],
})

const loading = ref(false)

const apiUrl = API_ENDPOINTS.assetRegistration

const { search, entries } = useTable(
  {
    search: '',
    entries: 10,
  },
  () => fetchAssets(),
)

const fetchAssets = async (url = apiUrl) => {
  loading.value = true

  try {
    const token = localStorage.getItem('token')

    const response = await axios.get(url, {
      params: {
        search: search.value,
        entries: entries.value,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    assets.value = {
      data: response.data.data ?? [],
      from: response.data.meta?.from ?? 0,
      to: response.data.meta?.to ?? 0,
      total: response.data.meta?.total ?? 0,
      links: response.data.meta?.links ?? [],
    }
  } catch (err) {
    console.error(err)

    assets.value = {
      data: [],
      from: 0,
      to: 0,
      total: 0,
      links: [],
    }
  } finally {
    loading.value = false
  }
}

const formatAssetClass = (value) => {
  switch (value) {
    case 'FIXED_ASSET':
      return 'Fixed Asset'

    case 'CONSUMABLE':
      return 'Consumable'

    case 'LICENSE':
      return 'License'

    default:
      return '-'
  }
}

const classColor = (value) => {
  switch (value) {
    case 'FIXED_ASSET':
      return 'bg-success/20 text-success'

    case 'CONSUMABLE':
      return 'bg-warning/20 text-warning'

    case 'LICENSE':
      return 'bg-primary/20 text-primary'

    default:
      return 'bg-gray-200 text-gray-600'
  }
}

const formatCurrency = (value) => {
  if (!value) return '-'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const formatDate = (value) => {
  if (!value) return '-'

  return new Date(value).toLocaleDateString('id-ID')
}

onMounted(fetchAssets)
</script>

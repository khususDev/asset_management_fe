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
      <!-- TAMBAHKAN ACTION DI HEADER SEBELAH KANAN / SEARCH -->
      <template #top-actions>
        <button
          class="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
          @click="$router.push({ name: 'opt_asset_registration.create_existing' })"
        >
          + Asset Registration (Manual)
        </button>
        <button
          @click="showImportModal = true"
          class="flex items-center gap-2 rounded bg-success px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Import Excel
        </button>

        <div
          v-if="showImportModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-boxdark">
            <h3 class="text-lg font-bold text-black dark:text-white mb-2">Import Data Aset</h3>
            <p class="text-sm text-body mb-4">
              Unggah file Excel berisi data aset eksisting. Gunakan format yang sesuai dengan
              template.
            </p>

            <!-- Tombol Download Template -->
            <div class="mb-4">
              <button
                @click="downloadTemplate"
                :disabled="isDownloading"
                class="text-xs text-primary underline flex items-center gap-1 hover:opacity-80"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {{ isDownloading ? 'Mengunduh Template...' : 'Download Template Excel' }}
              </button>
            </div>

            <!-- Input File -->
            <div class="mb-4">
              <input
                type="file"
                ref="fileInput"
                accept=".xlsx, .xls, .csv"
                @change="handleFileChange"
                class="w-full text-sm text-body border border-stroke rounded p-2 focus:border-primary outline-none"
              />
            </div>

            <!-- Tombol Aksi Modal -->
            <div class="flex justify-end gap-3">
              <button
                @click="closeModal"
                class="rounded border border-stroke px-4 py-2 text-sm text-body hover:bg-gray-2"
              >
                Batal
              </button>
              <button
                @click="uploadFile"
                :disabled="isUploading || !selectedFile"
                class="rounded bg-primary px-4 py-2 text-sm text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {{ isUploading ? 'Memproses...' : 'Upload & Import' }}
              </button>
            </div>
          </div>
        </div>
      </template>

      <TableLoading v-if="loading" :rows="5" :cols="7" />

      <tr v-else v-for="item in assets.data" :key="item.id">
        <td class="px-4 py-4 text-left">
          <div class="font-semibold">
            {{ item.asset.name }}
          </div>

          <!-- Tandai jika Aset Manual/Eksisting -->
          <div class="text-xs text-gray-500">
            {{ item.document.gr_number ?? 'MANUAL / EXISTING' }}
          </div>
        </td>

        <td class="text-center">
          <span :class="classColor(item.asset.class)" class="px-2 py-1 rounded text-xs font-medium">
            {{ formatAssetClass(item.asset.class) }}
          </span>
        </td>

        <td class="text-center">
          {{ item.department.name ?? '-' }}
        </td>

        <td class="text-center">
          {{ item.vendor.name ?? '-' }}
        </td>

        <td class="text-center">
          <div>{{ item.document.po_number ?? '-' }}</div>

          <div class="text-xs text-gray-500">
            {{ item.document.pr_number ?? '-' }}
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
            v-if="item.asset.status === 'WAITING_REGISTRATION'"
            class="rounded bg-primary px-3 py-1 text-white hover:bg-opacity-90 text-xs"
            @click="
              $router.push({
                name: 'opt_asset_registration.create',
                params: { id: item.id },
              })
            "
          >
            Register
          </button>
          <span v-else class="text-xs text-gray-400">Registered</span>
        </td>
      </tr>

      <TableEmpty v-if="!loading && (!assets.data || assets.data.length === 0)" :colspan="7" />

      <template #pagination>
        <Pagination :links="assets.links" @change-page="fetchAssets" />
      </template>
    </DataTable>

    <!-- Modal Form Aset Eksisting -->
    <RegisterExistingModal
      :show="showExistingModal"
      :masters="masters"
      @close="showExistingModal = false"
      @success="fetchAssets"
    />
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

const assets = ref({ data: [], from: 0, to: 0, total: 0, links: [] })
const loading = ref(false)
const showExistingModal = ref(false)

const masters = ref({
  categories: [],
  branches: [],
  locations: [],
  departments: [],
  statuses: [],
})

const apiUrl = API_ENDPOINTS.assetRegistration

const { search, entries } = useTable({ search: '', entries: 10 }, () => fetchAssets())

const fetchMasters = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(API_ENDPOINTS.optAssetDirectoryMasters, {
      headers: { Authorization: `Bearer ${token}` },
    })
    masters.value = response.data.data
  } catch (error) {
    console.error('Gagal mengambil data master:', error)
  }
}

const fetchAssets = async (url = apiUrl) => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
      headers: { Authorization: `Bearer ${token}` },
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
    assets.value = { data: [], from: 0, to: 0, total: 0, links: [] }
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

onMounted(() => {
  fetchAssets()
  fetchMasters()
})
</script>

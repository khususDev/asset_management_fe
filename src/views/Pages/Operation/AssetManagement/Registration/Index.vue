<template>
  <div class="mx-auto max-w-screen-2xl">
    <PageTitle title="Asset Registration" />

    <DataTable
      :headers="[
        'Asset / Item',
        'Class',
        'Department',
        'Vendor',
        'Ref / Doc Code',
        'Status',
        'Action',
      ]"
      :from="assets.from"
      :to="assets.to"
      :total="assets.total"
      :search="search"
      :entries="entries"
      @search="search = $event"
      @update:entries="entries = $event"
    >
      <!-- ACTION HEADER SEBELAH KANAN -->
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

        <!-- Modal Import -->
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

            <div class="mb-4">
              <input
                type="file"
                ref="fileInput"
                accept=".xlsx, .xls, .csv"
                @change="handleFileChange"
                class="w-full text-sm text-body border border-stroke rounded p-2 focus:border-primary outline-none"
              />
            </div>

            <div class="flex justify-end gap-3">
              <button
                @click="showImportModal = false"
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

      <tr v-else v-for="item in assets.data" :key="item.record_id + '-' + item.asset_class">
        <!-- 1. Nama Aset & Sumber -->
        <td class="px-4 py-4 text-left">
          <div class="font-semibold text-black dark:text-white">
            {{ item.item_name ?? '-' }}
          </div>
          <div class="text-xs text-gray-500">Source: {{ item.source ?? 'MANUAL' }}</div>
        </td>

        <!-- 2. Class -->
        <td class="text-center">
          <span :class="classColor(item.asset_class)" class="px-2 py-1 rounded text-xs font-medium">
            {{ formatAssetClass(item.asset_class) }}
          </span>
        </td>

        <!-- 3. Department -->
        <td class="text-center text-sm">
          {{ item.department_name ?? '-' }}
        </td>

        <!-- 4. Vendor -->
        <td class="text-center text-sm">
          {{ item.vendor_name ?? '-' }}
        </td>

        <!-- 5. Kode Referensi / Dokumen -->
        <td class="text-center text-sm font-mono">
          {{ item.reference_code ?? '-' }}
        </td>

        <!-- 6. Status -->
        <td class="text-center">
          <span
            class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
            :class="{
              'bg-warning/20 text-warning': item.registration_status === 'WAITING_REGISTRATION',
              'bg-success/20 text-success': item.registration_status === 'REGISTERED',
            }"
          >
            {{ item.registration_status === 'WAITING_REGISTRATION' ? 'WAITING' : 'REGISTERED' }}
          </span>
        </td>

        <!-- 7. Action -->
        <td class="text-center">
          <button
            v-if="item.registration_status === 'WAITING_REGISTRATION'"
            class="rounded bg-primary px-3 py-1 text-white hover:bg-opacity-90 text-xs font-medium"
            @click="
              $router.push({
                name: 'opt_asset_registration.create',
                params: { id: item.record_id },
              })
            "
          >
            Register
          </button>
          <span v-else class="text-xs text-gray-400 font-medium">Completed</span>
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
import PageTitle from '@/Components/common/PageTitle.vue'
import DataTable from '@/Components/Table/DataTable.vue'
import Pagination from '@/Components/Table/Pagination.vue'
import TableLoading from '@/Components/Table/TableLoading.vue'
import TableEmpty from '@/Components/Table/TableEmpty.vue'

const assets = ref({ data: [], from: 0, to: 0, total: 0, links: [] })
const loading = ref(false)
const showImportModal = ref(false)

const apiUrl = API_ENDPOINTS.assetRegistration

const { search, entries } = useTable({ search: '', entries: 10 }, () => fetchAssets())

const fetchAssets = async (url = apiUrl) => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
      headers: { Authorization: `Bearer ${token}` },
    })

    const rawData = response.data.data ?? []

    // Karena backend mengembalikan array hasil gabungan
    assets.value = {
      data: Array.isArray(rawData) ? rawData : (rawData.data ?? []),
      from: response.data.meta?.from ?? (rawData.length > 0 ? 1 : 0),
      to: response.data.meta?.to ?? rawData.length,
      total: response.data.meta?.total ?? rawData.length,
      links: response.data.meta?.links ?? [],
    }
  } catch (err) {
    console.error('Error fetching registration data:', err)
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
})
</script>

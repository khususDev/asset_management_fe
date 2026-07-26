<template>
    <div class="mx-auto max-w-screen-2xl relative">
        <!-- Toast Notification -->
        <div v-if="toast.show"
            class="fixed top-5 right-5 z-99999 flex w-full max-w-sm rounded-lg border bg-white p-4 shadow-xl dark:bg-boxdark"
            :class="toast.type === 'success' ? 'border-success bg-success/5' : 'border-danger bg-danger/5'">
            <div class="mr-3 flex h-5 w-5 items-center justify-center rounded-full text-white"
                :class="toast.type === 'success' ? 'bg-success' : 'bg-danger'">
                <span class="text-xs font-bold">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
            </div>
            <div>
                <h5 class="font-semibold text-black dark:text-white text-sm">
                    {{ toast.type === 'success' ? 'Sukses' : 'Gagal' }}
                </h5>
                <p class="text-xs text-gray-500 mt-0.5">{{ toast.message }}</p>
            </div>
        </div>

        <!-- Breadcrumb -->
        <Breadcrumb pageTitle="Asset Registration" :crumbs="['Operations', 'Asset Management']" />

        <!-- Data Table Component -->
        <DataTable :headers="[
            'Asset Code',
            'Asset Name',
            'Category / Type',
            'Vendor',
            'Purchase Cost',
            'Status',
            'Action',
        ]" :from="assetData.from" :to="assetData.to" :total="assetData.total" :search="search" :entries="entries"
            @search="search = $event" @update:entries="entries = $event">
            <!-- Filter Status Tabs in #top-actions -->
            <template #top-actions>
                <div class="flex items-center gap-2 bg-gray-100 p-1 rounded-lg dark:bg-meta-4">
                    <button @click="changeTab('DRAFT')"
                        class="px-3 py-1.5 text-xs font-medium rounded-md transition-all" :class="activeTab === 'DRAFT'
                            ? 'bg-white text-primary shadow dark:bg-boxdark dark:text-white'
                            : 'text-gray-600 hover:text-black dark:text-gray-400'
                            ">
                        Draft (Belum Mendaftar)
                    </button>
                    <button @click="changeTab('REGISTERED')"
                        class="px-3 py-1.5 text-xs font-medium rounded-md transition-all" :class="activeTab === 'REGISTERED'
                            ? 'bg-white text-primary shadow dark:bg-boxdark dark:text-white'
                            : 'text-gray-600 hover:text-black dark:text-gray-400'
                            ">
                        Registered (Terdaftar)
                    </button>
                </div>
            </template>

            <!-- Table Loading -->
            <TableLoading v-if="isFetching" :rows="5" :cols="7" />

            <!-- Table Body Data Rows -->
            <tr v-else v-for="asset in assetData.data" :key="asset.id"
                class="border-b border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4">
                <!-- Asset Code -->
                <td class="border-r border-stroke px-4 py-4 text-center font-bold text-primary dark:border-strokedark">
                    <span v-if="asset.asset_code">{{ asset.asset_code }}</span>
                    <span v-else class="text-xs font-normal italic text-gray-400">Belum Generik</span>
                </td>

                <!-- Asset Name & Serial Number -->
                <td class="border-r border-stroke px-4 py-4 dark:border-strokedark">
                    <div class="font-semibold text-black dark:text-white">{{ asset.name }}</div>
                    <div v-if="asset.serial_number" class="text-xs text-gray-500">
                        S/N: {{ asset.serial_number }}
                    </div>
                </td>

                <!-- Category / Type -->
                <td class="border-r border-stroke px-4 py-4 text-center dark:border-strokedark">
                    <div v-if="asset.category" class="text-sm font-medium text-black dark:text-white">
                        {{ asset.category.name }}
                    </div>
                    <div v-if="asset.type" class="text-xs text-gray-500">
                        {{ asset.type.name }}
                    </div>
                    <span v-if="!asset.category && !asset.type" class="text-xs italic text-gray-400">-</span>
                </td>

                <!-- Vendor & Purchase Date -->
                <td class="border-r border-stroke px-4 py-4 text-center dark:border-strokedark">
                    <div class="text-sm text-black dark:text-white">
                        {{ asset.vendor?.name || '-' }}
                    </div>
                    <div class="text-xs text-gray-400">
                        {{ formatDate(asset.purchase_date) }}
                    </div>
                </td>

                <!-- Purchase Cost -->
                <td class="border-r border-stroke px-4 py-4 text-right font-medium dark:border-strokedark">
                    {{ formatCurrency(asset.purchase_cost) }}
                </td>

                <!-- Registration Status -->
                <td class="border-r border-stroke px-4 py-4 text-center dark:border-strokedark">
                    <span class="inline-block rounded px-2.5 py-0.5 text-xs font-semibold" :class="{
                        'bg-warning/20 text-warning': asset.registration_status === 'DRAFT',
                        'bg-success/20 text-success': asset.registration_status === 'REGISTERED',
                    }">
                        {{ asset.registration_status }}
                    </span>
                </td>

                <!-- Action Buttons -->
                <td class="border-r border-stroke px-4 py-4 text-center dark:border-strokedark">
                    <div class="flex items-center justify-center gap-2">
                        <!-- Pendaftaran Aset (Jika Status DRAFT) - Navigasi ke Halaman Baru -->
                        <button v-if="asset.registration_status === 'DRAFT'"
                            @click="$router.push({ name: 'opt_asset_registration.register', params: { id: asset.id } })"
                            class="rounded bg-primary py-1.5 px-3 text-xs font-medium text-white hover:bg-opacity-90 shadow-sm"
                            title="Proses Registrasi">
                            Registrasi
                        </button>

                        <!-- View Detail (Jika Status REGISTERED) -->
                        <button v-else @click="openDetailModal(asset)"
                            class="text-gray-500 hover:text-primary transition-colors" title="Lihat Detail">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                </path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>

            <!-- Table Empty State -->
            <TableEmpty v-if="!isFetching && (!assetData.data || assetData.data.length === 0)" :colspan="7" />

            <!-- Pagination -->
            <template #pagination>
                <Pagination :links="assetData.links" @change-page="fetchAssets" />
            </template>
        </DataTable>
    </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import DataTable from '@/Components/Table/DataTable.vue'
import Pagination from '@/Components/Table/Pagination.vue'
import TableLoading from '@/Components/Table/TableLoading.vue'
import TableEmpty from '@/Components/Table/TableEmpty.vue'

import useTable from '@/Composables/useTable'
import { API_ENDPOINTS } from '@/api/endpoints'

const assetData = ref({})
const isFetching = ref(false)
const activeTab = ref('DRAFT')

const selectedAsset = ref({})
const isReadOnly = ref(false)

// State Toast
const toast = ref({ show: false, type: 'success', message: '' })
const showToast = (type, message) => {
    toast.value = { show: true, type, message }
    setTimeout(() => {
        toast.value.show = false
    }, 4000)
}

// Endpoint API
const apiUrl = API_ENDPOINTS.optAssetRegistration || '/opt_asset_registration'

const { search, entries } = useTable(
    {
        search: '',
        entries: 10,
    },
    () => fetchAssets(),
)

const fetchAssets = async (url = apiUrl) => {
    isFetching.value = true

    try {
        const token = localStorage.getItem('token')

        const response = await axios.get(url, {
            params: {
                search: search.value,
                entries: entries.value,
                registration_status: activeTab.value,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        assetData.value = response.data.data
    } catch (err) {
        console.error(err)
        showToast('error', 'Gagal memuat data aset.')
    } finally {
        isFetching.value = false
    }
}

const changeTab = (tab) => {
    activeTab.value = tab
    fetchAssets()
}

const openDetailModal = (asset) => {
    selectedAsset.value = asset
    isReadOnly.value = true
}

const formatCurrency = (value) => {
    if (!value) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value)
}

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(() => {
    fetchAssets()
})
</script>
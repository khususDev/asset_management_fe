<template>
  <div class="p-3 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <PageTitle title="Consumable Inventory" />
      <div>
        <button
          @click="fetchConsumables"
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

    <!-- 1. Tracker Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Total Jenis Barang -->
      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div class="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Item</p>
          <p class="text-2xl font-bold text-gray-900">{{ totalItemsCount }}</p>
        </div>
      </div>

      <!-- Total Akumulasi Stok -->
      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div class="p-3 rounded-lg bg-emerald-50 text-emerald-600 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Total Kuantitas Stok
          </p>
          <p class="text-2xl font-bold text-gray-900">{{ totalStockQty }}</p>
        </div>
      </div>

      <!-- Stok Menipis Warning -->
      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div class="p-3 rounded-lg bg-amber-50 text-amber-600 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Stok Menipis</p>
          <p class="text-2xl font-bold text-amber-600">{{ lowStockCount }}</p>
        </div>
      </div>

      <!-- Stok Habis Alert -->
      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div class="p-3 rounded-lg bg-rose-50 text-rose-600 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Stok Habis (0)</p>
          <p class="text-2xl font-bold text-rose-600">{{ outOfStockCount }}</p>
        </div>
      </div>
    </div>

    <!-- 2. Search & Filter Bar -->
    <div
      class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center"
    >
      <div class="relative w-full md:w-96">
        <span
          class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari item, kode, kategori, vendor..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="flex items-center gap-2 w-full md:w-auto">
        <label class="text-xs font-medium text-gray-600 whitespace-nowrap">Filter Stok:</label>
        <select
          v-model="statusFilter"
          class="w-full md:w-48 py-2 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">Semua Status</option>
          <option value="SAFE">Stok Aman</option>
          <option value="LOW">Stok Menipis</option>
          <option value="EMPTY">Stok Habis</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm"
    >
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-3"
      ></div>
      <p class="text-sm font-medium text-gray-500">Memuat data barang habis pakai...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center text-rose-700"
    >
      <p class="font-medium mb-2">Terjadi Kesalahan</p>
      <p class="text-sm">{{ error }}</p>
      <button
        @click="fetchConsumables"
        class="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700"
      >
        Coba Lagi
      </button>
    </div>

    <!-- 3. Data Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              <th class="py-3.5 px-4">Kode Item</th>
              <th class="py-3.5 px-4">Nama Barang</th>
              <th class="py-3.5 px-4">Kategori & Vendor</th>
              <th class="py-3.5 px-4">Jumlah Stok</th>
              <th class="py-3.5 px-4">Status Stok</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 text-sm">
            <tr
              v-for="item in filteredConsumables"
              :key="item.id"
              class="hover:bg-gray-50/80 transition-colors"
            >
              <td class="py-4 px-4 font-mono font-medium text-blue-600">
                {{ item.item_code || '-' }}
              </td>
              <td class="py-4 px-4 font-semibold text-gray-900">{{ item.item_name }}</td>
              <td class="py-4 px-4">
                <div class="text-gray-800 font-medium">{{ item.category_name || '-' }}</div>
                <div class="text-xs text-gray-400">{{ item.vendor_name || 'No Vendor' }}</div>
              </td>
              <td class="py-4 px-4 font-bold text-gray-800">
                {{ getItemQty(item) }} {{ item.unit || 'Pcs' }}
              </td>
              <td class="py-4 px-4">
                <span
                  :class="getStockBadge(item).badgeClass"
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full mr-1.5"
                    :class="getStockBadge(item).dotClass"
                  ></span>
                  {{ getStockBadge(item).label }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredConsumables.length === 0">
              <td colspan="5" class="py-12 text-center text-gray-400">
                Tidak ada data consumable yang sesuai.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import PageTitle from '@/Components/common/PageTitle.vue'

const consumables = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('ALL')

const fetchConsumables = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('consumables')
    if (response.data.success) {
      consumables.value = response.data.data
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal memuat data.'
  } finally {
    loading.value = false
  }
}

// Helpers
const getItemQty = (item) => Number(item.quantity ?? item.qty ?? item.stock ?? 0)
const getItemMinStock = (item) => Number(item.min_stock ?? 5)

const getStockBadge = (item) => {
  const qty = getItemQty(item)
  const min = getItemMinStock(item)

  if (qty <= 0) {
    return {
      label: 'Habis',
      badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
      dotClass: 'bg-rose-500',
    }
  } else if (qty <= min) {
    return {
      label: 'Menipis',
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
      dotClass: 'bg-amber-500',
    }
  }
  return {
    label: 'Aman',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dotClass: 'bg-emerald-500',
  }
}

// Computed Metrics
const totalItemsCount = computed(() => consumables.value.length)
const totalStockQty = computed(() => consumables.value.reduce((acc, c) => acc + getItemQty(c), 0))
const lowStockCount = computed(
  () =>
    consumables.value.filter((c) => getItemQty(c) > 0 && getItemQty(c) <= getItemMinStock(c))
      .length,
)
const outOfStockCount = computed(() => consumables.value.filter((c) => getItemQty(c) <= 0).length)

const filteredConsumables = computed(() => {
  return consumables.value.filter((item) => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch =
      !q ||
      item.item_code?.toLowerCase().includes(q) ||
      item.item_name?.toLowerCase().includes(q) ||
      item.category_name?.toLowerCase().includes(q)

    const qty = getItemQty(item)
    const min = getItemMinStock(item)
    let matchesStatus = true

    if (statusFilter.value === 'SAFE') matchesStatus = qty > min
    if (statusFilter.value === 'LOW') matchesStatus = qty > 0 && qty <= min
    if (statusFilter.value === 'EMPTY') matchesStatus = qty <= 0

    return matchesSearch && matchesStatus
  })
})

onMounted(() => fetchConsumables())
</script>

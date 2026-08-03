<template>
  <div class="p-3 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <PageTitle title="License Directory" />
      <div>
        <button
          @click="fetchLicenses"
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

    <!-- 1. Tracker Metrics / Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Total License -->
      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div class="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Software</p>
          <p class="text-2xl font-bold text-gray-900">{{ totalLicensesCount }}</p>
        </div>
      </div>

      <!-- Total & Sisa Seats -->
      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div class="p-3 rounded-lg bg-indigo-50 text-indigo-600 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Sisa / Total Seats
          </p>
          <p class="text-2xl font-bold text-gray-900">
            <span class="text-emerald-600">{{ availableSeats }}</span>
            <span class="text-gray-400 font-normal text-lg"> / {{ totalSeats }}</span>
          </p>
        </div>
      </div>

      <!-- Expiring Soon Warning -->
      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div class="p-3 rounded-lg bg-amber-50 text-amber-600 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Kadaluarsa (≤30 Hari)
          </p>
          <p class="text-2xl font-bold text-amber-600">{{ expiringSoonCount }}</p>
        </div>
      </div>

      <!-- Expired Alert -->
      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
        <div class="p-3 rounded-lg bg-rose-50 text-rose-600 mr-4">
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
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Kadaluarsa / Habis
          </p>
          <p class="text-2xl font-bold text-rose-600">{{ expiredCount }}</p>
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
          placeholder="Cari lisensi, software, kategori, vendor..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="flex items-center gap-2 w-full md:w-auto">
        <label class="text-xs font-medium text-gray-600 whitespace-nowrap">Filter Status:</label>
        <select
          v-model="statusFilter"
          class="w-full md:w-48 py-2 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">Semua Status</option>
          <option value="ACTIVE">Aktif</option>
          <option value="EXPIRING_SOON">Akan Kadaluarsa</option>
          <option value="EXPIRED">Sudah Kadaluarsa</option>
          <option value="FULL">Seats Penuh</option>
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
      <p class="text-sm font-medium text-gray-500">Memuat data lisensi software...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center text-rose-700"
    >
      <p class="font-medium mb-2">Terjadi Kesalahan</p>
      <p class="text-sm">{{ error }}</p>
      <button
        @click="fetchLicenses"
        class="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition"
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
              <th class="py-3.5 px-4">Kode Lisensi</th>
              <th class="py-3.5 px-4">Nama Software</th>
              <th class="py-3.5 px-4">Kategori & Vendor</th>
              <th class="py-3.5 px-4">Pengalokasian Seats</th>
              <th class="py-3.5 px-4">Masa Berlaku</th>
              <th class="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 text-sm">
            <tr
              v-for="item in filteredLicenses"
              :key="item.id"
              class="hover:bg-gray-50/80 transition-colors"
            >
              <!-- Kode Lisensi -->
              <td class="py-4 px-4 font-mono font-medium text-blue-600">
                {{ item.license_code || '-' }}
              </td>

              <!-- Nama Software -->
              <td class="py-4 px-4">
                <div class="font-semibold text-gray-900">{{ item.software_name }}</div>
              </td>

              <!-- Kategori & Vendor -->
              <td class="py-4 px-4">
                <div class="text-gray-800 font-medium">{{ item.category_name || '-' }}</div>
                <div class="text-xs text-gray-400">{{ item.vendor_name || 'No Vendor' }}</div>
              </td>

              <!-- Seats Utilization (Visual Progress Bar + Details) -->
              <td class="py-4 px-4 min-w-[200px]">
                <div class="flex justify-between items-center text-xs mb-1">
                  <span class="font-medium text-gray-700">
                    {{ item.used_seats || 0 }} dari {{ item.total_seats || 0 }} Terpakai
                  </span>
                  <span
                    class="font-semibold"
                    :class="
                      getSeatsAvailableCount(item) === 0 ? 'text-rose-600' : 'text-emerald-600'
                    "
                  >
                    Sisa: {{ getSeatsAvailableCount(item) }}
                  </span>
                </div>
                <!-- Progress Bar -->
                <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    class="h-2 rounded-full transition-all duration-300"
                    :class="getSeatUsageColorClass(item)"
                    :style="{ width: `${getSeatUsagePercentage(item)}%` }"
                  ></div>
                </div>
              </td>

              <!-- Masa Berlaku -->
              <td class="py-4 px-4">
                <div class="text-gray-800 font-medium">{{ formatDate(item.expiration_date) }}</div>
                <div class="text-xs text-gray-500">
                  {{ getExpiryDaysText(item.expiration_date) }}
                </div>
              </td>

              <!-- Status Badge -->
              <td class="py-4 px-4">
                <span
                  :class="getExpiryStatus(item.expiration_date).badgeClass"
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full mr-1.5"
                    :class="getExpiryStatus(item.expiration_date).dotClass"
                  ></span>
                  {{ getExpiryStatus(item.expiration_date).label }}
                </span>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredLicenses.length === 0">
              <td colspan="6" class="py-12 text-center text-gray-400">
                <svg
                  class="w-12 h-12 mx-auto mb-3 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p class="text-base font-medium text-gray-600">Tidak ada data lisensi ditemukan</p>
                <p class="text-xs text-gray-400 mt-1">
                  Coba sesuaikan kata kunci pencarian atau filter status Anda.
                </p>
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

// Reactive States
const licenses = ref([])
const loading = ref(true)
const error = ref(null)

const searchQuery = ref('')
const statusFilter = ref('ALL')

// API Fetcher
const fetchLicenses = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('licenses')
    if (response.data.success) {
      licenses.value = response.data.data
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal terhubung ke server.'
  } finally {
    loading.value = false
  }
}

// ---------------------------------------------------------------------
// Metrics & Calculations
// ---------------------------------------------------------------------
const totalLicensesCount = computed(() => licenses.value.length)

const totalSeats = computed(() => {
  return licenses.value.reduce((acc, curr) => acc + (Number(curr.total_seats) || 0), 0)
})

const usedSeats = computed(() => {
  return licenses.value.reduce((acc, curr) => acc + (Number(curr.used_seats) || 0), 0)
})

const availableSeats = computed(() => {
  return totalSeats.value - usedSeats.value
})

const expiringSoonCount = computed(() => {
  return licenses.value.filter(
    (item) => getExpiryStatus(item.expiration_date).code === 'EXPIRING_SOON',
  ).length
})

const expiredCount = computed(() => {
  return licenses.value.filter((item) => getExpiryStatus(item.expiration_date).code === 'EXPIRED')
    .length
})

// ---------------------------------------------------------------------
// Helper Functions: Expiry & Dates
// ---------------------------------------------------------------------
const getExpiryStatus = (expirationDate) => {
  if (!expirationDate) {
    return {
      code: 'PERMANENT',
      label: 'Permanen / Unlimited',
      badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
      dotClass: 'bg-blue-500',
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expirationDate)
  expiry.setHours(0, 0, 0, 0)

  const diffTime = expiry - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return {
      code: 'EXPIRED',
      label: 'Kadaluarsa',
      badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
      dotClass: 'bg-rose-500',
    }
  } else if (diffDays <= 30) {
    return {
      code: 'EXPIRING_SOON',
      label: 'Akan Kadaluarsa',
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
      dotClass: 'bg-amber-500',
    }
  } else {
    return {
      code: 'ACTIVE',
      label: 'Aktif',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      dotClass: 'bg-emerald-500',
    }
  }
}

const getExpiryDaysText = (expirationDate) => {
  if (!expirationDate) return 'Tidak ada batas waktu'

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expirationDate)
  expiry.setHours(0, 0, 0, 0)

  const diffTime = expiry - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return `Lewat ${Math.abs(diffDays)} hari yang lalu`
  if (diffDays === 0) return 'Hari ini'
  return `Sisa ${diffDays} hari lagi`
}

const formatDate = (dateString) => {
  if (!dateString) return 'Permanen'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ---------------------------------------------------------------------
// Helper Functions: Seats & Utilization Progress Bar
// ---------------------------------------------------------------------
const getSeatsAvailableCount = (item) => {
  const total = Number(item.total_seats) || 0
  const used = Number(item.used_seats) || 0
  return Math.max(0, total - used)
}

const getSeatUsagePercentage = (item) => {
  const total = Number(item.total_seats) || 0
  const used = Number(item.used_seats) || 0
  if (total <= 0) return 0
  const pct = (used / total) * 100
  return Math.min(100, Math.max(0, pct))
}

const getSeatUsageColorClass = (item) => {
  const pct = getSeatUsagePercentage(item)
  if (pct >= 100) return 'bg-rose-500'
  if (pct >= 80) return 'bg-amber-500'
  return 'bg-blue-500'
}

// ---------------------------------------------------------------------
// Filtered Table Computed Property
// ---------------------------------------------------------------------
const filteredLicenses = computed(() => {
  return licenses.value.filter((item) => {
    // 1. Search Query Match
    const query = searchQuery.value.toLowerCase()
    const matchesSearch =
      !query ||
      item.license_code?.toLowerCase().includes(query) ||
      item.software_name?.toLowerCase().includes(query) ||
      item.category_name?.toLowerCase().includes(query) ||
      item.vendor_name?.toLowerCase().includes(query)

    // 2. Status Filter Match
    const expiryCode = getExpiryStatus(item.expiration_date).code
    const isFull = getSeatsAvailableCount(item) === 0

    let matchesStatus = true
    if (statusFilter.value === 'ACTIVE')
      matchesStatus = expiryCode === 'ACTIVE' || expiryCode === 'PERMANENT'
    if (statusFilter.value === 'EXPIRING_SOON') matchesStatus = expiryCode === 'EXPIRING_SOON'
    if (statusFilter.value === 'EXPIRED') matchesStatus = expiryCode === 'EXPIRED'
    if (statusFilter.value === 'FULL') matchesStatus = isFull

    return matchesSearch && matchesStatus
  })
})

// Lifecycle
onMounted(() => {
  fetchLicenses()
})
</script>

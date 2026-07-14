<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import DashboardSummary from '@/components/dashboard/DashboardSummary.vue'
import DashboardMetrics from '@/components/dashboard/DashboardMetrics.vue'
import DashboardCharts from '@/components/dashboard/DashboardCharts.vue'

const authStore = useAuthStore()
const userName = computed(() => authStore.user?.name || 'User')

const dashboardStats = ref([
  {
    label: 'Total Asset',
    value: '1,248',
    change: '+12%',
    desc: 'Updated weekly',
  },
  {
    label: 'Permintaan Aktif',
    value: '73',
    change: '+5%',
    desc: 'Dalam proses persetujuan',
  },
  {
    label: 'Persetujuan Tertunda',
    value: '18',
    change: '-3%',
    desc: 'Perlu tindakan manajer',
  },
  {
    label: 'Budget Tersedia',
    value: 'Rp 325.000.000',
    change: '+8%',
    desc: 'Sisa anggaran triwulan',
  },
])

const latestRequests = ref([
  { id: 'RQ-1024', asset: 'Laptop Dell XPS 13', requester: 'Aditya', status: 'Approved' },
  { id: 'RQ-1025', asset: 'Monitor Samsung 27"', requester: 'Rina', status: 'Pending' },
  { id: 'RQ-1026', asset: 'Printer Brother', requester: 'Faisal', status: 'Rejected' },
  { id: 'RQ-1027', asset: 'Harddisk 1TB', requester: 'Sari', status: 'Approved' },
])

const topCategories = ref([
  { name: 'Laptop', count: 412 },
  { name: 'Monitor', count: 238 },
  { name: 'Printer', count: 87 },
  { name: 'Network', count: 59 },
])
</script>

<template>
  <div class="space-y-6">
    <div
      class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
    >
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="mb-2 text-title-md2 font-semibold text-black dark:text-white">
            Selamat Datang, {{ userName }}!
          </h2>
          <p class="text-bodydark2 max-w-2xl">
            Ini dashboard utama sistem Asset Management Anda. Data berikut bersifat dummy; nanti
            cukup ganti sumber datanya dengan API backend.
          </p>
        </div>
        <div
          class="rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary dark:bg-primary/20 dark:text-white"
        >
          Status: <span class="font-semibold">Sistem Siap</span>
        </div>
      </div>
    </div>

    <DashboardSummary :stats="dashboardStats" />

    <DashboardMetrics :categories="topCategories" :requests="latestRequests" />

    <DashboardCharts />
  </div>
</template>

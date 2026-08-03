<template>
  <div class="mx-auto max-w-screen-2xl">
    <!-- Toast Notification -->
    <div
      v-if="toast.show"
      class="fixed top-5 right-5 z-99999 flex w-full max-w-sm rounded-lg border bg-white p-4 shadow-xl dark:bg-boxdark"
      :class="
        toast.type === 'success' ? 'border-success bg-success/5' : 'border-danger bg-danger/5'
      "
    >
      <div
        class="mr-3 flex h-5 w-5 items-center justify-center rounded-full text-white"
        :class="toast.type === 'success' ? 'bg-success' : 'bg-danger'"
      >
        <span class="text-xs font-bold">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
      </div>
      <div>
        <h5 class="font-semibold text-black dark:text-white text-sm">
          {{ toast.type === 'success' ? 'Sukses' : 'Gagal' }}
        </h5>
        <p class="text-xs text-gray-500 mt-0.5">{{ toast.message }}</p>
      </div>
    </div>

    <PageTitle title="Goods Receipt" />

    <DataTable
      :headers="['GR Number', 'Receipt Date', 'PO Number', 'Vendor', 'Status', 'Action']"
      :from="grData.from"
      :to="grData.to"
      :total="grData.total"
      :search="search"
      :entries="entries"
      @search="search = $event"
      @update:entries="entries = $event"
    >
      <template #top-actions>
        <button
          @click="$router.push({ name: 'opt_goods_receipt.create' })"
          class="rounded bg-primary py-2 px-4 text-white hover:bg-opacity-90 transition"
        >
          Create Goods Receipt
        </button>
      </template>

      <tr v-for="gr in grData.data" :key="gr.id" class="border-b dark:border-strokedark">
        <td class="p-4 text-center">
          {{ gr.gr_number }}
        </td>

        <td class="p-4 text-center">
          <!-- Fallback jika receipt_date null, tampilkan created_at atau strip (-) -->
          {{ gr.receipt_date || gr.gr_date || gr.created_at || '-' }}
        </td>

        <td class="p-4 text-center">
          {{ gr.purchase_order?.po_number || '-' }}
        </td>

        <td class="p-4 text-center">
          {{ gr.purchase_order?.vendor?.name || '-' }}
        </td>

        <td class="p-4 text-center">
          <span
            class="inline-flex rounded-full px-3 py-1 text-xs font-medium"
            :class="{
              'bg-warning/10 text-warning': gr.status === 'DRAFT',
              'bg-success/10 text-success': gr.status === 'POSTED',
            }"
          >
            {{ gr.status }}
          </span>
        </td>

        <!-- Menggunakan Komponen TableAction -->
        <td class="p-4 text-center">
          <TableAction
            show-view
            show-print
            :show-post="gr.status === 'DRAFT'"
            @view="openDetailModal(gr.id)"
            @post="confirmPostGR(gr.id)"
            @print="printGR(gr.id)"
          />
        </td>
      </tr>
    </DataTable>

    <!-- Modal Detail Diletakkan di Luar Tabel -->
    <DetailModal
      :show="showDetailModal"
      :goods-receipt="selectedGR"
      @close="showDetailModal = false"
    />

    <!-- Modal Konfirmasi Post (Menggunakan ConfirmModal yang Sama) -->
    <ConfirmModal
      :show="showPostModal"
      title="Konfirmasi Post Goods Receipt"
      message="Apakah Anda yakin ingin melakukan POST pada Goods Receipt ini? Status akan dikunci dan data stok/aset akan diproses."
      confirm-text="Ya, Post"
      type="success"
      @close="showPostModal = false"
      @confirm="executePostGR"
    />
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import PageTitle from '@/Components/common/PageTitle.vue'
import DataTable from '@/Components/Table/DataTable.vue'
import TableAction from '@/Components/Table/TableAction.vue'
import ConfirmModal from '@/Components/Modal/ConfirmModal.vue' // Import ConfirmModal yang sudah diperbarui
import { API_ENDPOINTS } from '@/api/endpoints'
import useTable from '@/Composables/useTable'
import DetailModal from './components/DetailModal.vue'

const showDetailModal = ref(false)
const selectedGR = ref({})
const apiUrl = API_ENDPOINTS.optGoodsReceipt
const grData = ref({})

// State untuk Modal Konfirmasi Post
const showPostModal = ref(false)
const targetPostId = ref(null)

// State Toast
const toast = ref({ show: false, type: 'success', message: '' })
const showToast = (type, message) => {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

const { search, entries } = useTable({ search: '', entries: 10 }, () => fetchData())

const fetchData = async (url = apiUrl) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
      headers: { Authorization: `Bearer ${token}` },
    })
    grData.value = response.data.data
  } catch (error) {
    showToast('danger', 'Gagal memuat data Goods Receipt.')
  }
}

const printGR = async (id) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiUrl}/${id}/print`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const printWindow = window.open('', '_blank')
    printWindow.document.write(response.data)
    printWindow.document.close()
  } catch (error) {
    showToast('danger', 'Gagal mencetak dokumen GR.')
  }
}

const openDetailModal = async (id) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    selectedGR.value = response.data.data
    showDetailModal.value = true
  } catch (error) {
    showToast('danger', 'Gagal mengambil detail GR.')
  }
}

// 1. Trigger saat tombol Post diklik pada baris tabel
const confirmPostGR = (id) => {
  targetPostId.value = id
  showPostModal.value = true
}

// 2. Dieksekusi setelah user menekan tombol konfirmasi di dalam modal
const executePostGR = async () => {
  showPostModal.value = false
  try {
    const token = localStorage.getItem('token')
    const response = await axios.post(
      `${apiUrl}/${targetPostId.value}/post`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    showToast('success', response.data.message || 'Goods Receipt berhasil di-POST!')
    fetchData()
  } catch (error) {
    showToast('danger', error.response?.data?.message || 'Gagal melakukan POST GR.')
  } finally {
    targetPostId.value = null
  }
}

onMounted(() => {
  fetchData()
})
</script>

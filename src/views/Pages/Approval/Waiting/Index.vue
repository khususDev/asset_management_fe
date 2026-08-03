<template>
  <div class="mx-auto max-w-screen-2xl relative">
    <PageTitle title="Waiting Approval" />

    <DataTable
      :headers="['No Document', 'Modul', 'Created', 'Department', 'Date', 'Status', 'Action']"
      :from="inboxData.from"
      :to="inboxData.to"
      :total="inboxData.total"
      :search="search"
      :entries="entries"
      @search="search = $event"
      @update:entries="entries = $event"
    >
      <TableLoading v-if="isFetching" :rows="5" :cols="6" />

      <tr
        v-else
        v-for="item in inboxData.data"
        :key="item.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center font-bold text-primary dark:text-white dark:border-strokedark"
        >
          {{ item.approvable?.request_number || 'N/A' }}
        </td>

        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white dark:border-strokedark"
        >
          <span
            class="inline-block rounded bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-semibold dark:bg-blue-900 dark:text-blue-200"
          >
            {{ item.approvable_type?.split('\\').pop() }}
          </span>
        </td>

        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white dark:border-strokedark"
        >
          {{ item.approvable?.user?.name || 'Unknown' }}
        </td>

        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white dark:border-strokedark"
        >
          {{ item.approvable?.department?.code || '-' }}
        </td>

        <td
          class="border-r border-stroke px-4 py-5 text-center text-gray-600 dark:text-gray-400 dark:border-strokedark"
        >
          {{ formatDate(item.created_at) }}
        </td>

        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white dark:border-strokedark"
        >
          <span
            class="inline-block rounded px-2.5 py-0.5 text-xs font-semibold"
            :class="{
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                item.status === 'PENDING',
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                item.status === 'APPROVED',
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200':
                item.status === 'REJECTED',
              'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200':
                item.status === 'MANUAL',
            }"
          >
            {{ item.status }}
          </span>
        </td>

        <td class="px-4 py-5 text-center">
          <div class="flex items-center justify-center gap-3">
            <button
              @click="openDetailModal(item.approvable)"
              class="text-gray-500 hover:text-primary transition-colors"
              title="Lihat Detail Pengajuan"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>

            <button
              @click="openActionModal(item, 'APPROVE')"
              class="rounded bg-success py-1.5 px-3 text-xs font-medium text-white hover:bg-opacity-90 shadow"
            >
              ✓ Approve
            </button>
            <button
              @click="openActionModal(item, 'REJECT')"
              class="rounded bg-danger py-1.5 px-3 text-xs font-medium text-white hover:bg-opacity-90 shadow"
            >
              ✕ Reject
            </button>
          </div>
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!inboxData.data || inboxData.data.length === 0)"
        :colspan="6"
      />

      <template #pagination>
        <Pagination :links="inboxData.links" @change-page="fetchInbox" />
      </template>
    </DataTable>

    <div
      v-if="modal.show"
      class="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-boxdark border border-stroke dark:border-strokedark"
      >
        <h3 class="text-lg font-bold text-black dark:text-white mb-2">
          {{ modal.type === 'APPROVE' ? 'Setujui Dokumen' : 'Tolak Dokumen' }}
        </h3>

        <div
          class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-300"
        >
          Tindakan Anda akan memproses <span class="font-bold">Level {{ modal.level }}</span> untuk
          jabatan <span class="font-bold uppercase">{{ modal.roleName }}</span
          >.
        </div>

        <p class="text-sm text-gray-500 mb-4">
          Dokumen Nomor:
          <span class="font-bold text-primary">{{ modal.item?.approvable?.request_number }}</span>
        </p>

        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-black dark:text-white">
            Catatan / Alasan {{ modal.type === 'REJECT' ? '*' : '(Opsional)' }}
          </label>
          <textarea
            v-model="modal.note"
            rows="3"
            :placeholder="
              modal.type === 'REJECT'
                ? 'Wajib mengisi alasan penolakan...'
                : 'Tambahkan catatan jika diperlukan...'
            "
            class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
          ></textarea>
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="modal.show = false"
            class="rounded border border-stroke px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
          >
            Batal
          </button>
          <button
            @click="executeAction"
            :disabled="modal.loading || (modal.type === 'REJECT' && !modal.note.trim())"
            class="rounded px-4 py-2 text-sm font-medium text-white shadow-md transition-all disabled:opacity-50"
            :class="
              modal.type === 'APPROVE'
                ? 'bg-success hover:bg-opacity-90'
                : 'bg-danger hover:bg-opacity-90'
            "
          >
            {{
              modal.loading
                ? 'Memproses...'
                : modal.type === 'APPROVE'
                  ? 'Ya, Approve'
                  : 'Ya, Reject'
            }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="detailModal.show"
      class="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        class="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-boxdark border border-stroke dark:border-strokedark max-h-[95vh] overflow-y-auto"
      >
        <div
          class="flex justify-between items-center mb-4 border-b border-stroke pb-2 dark:border-strokedark"
        >
          <h3 class="text-xl font-bold text-black dark:text-white">
            Detail Item Pengajuan:
            <span class="text-primary">{{ detailModal.data?.request_number }}</span>
          </h3>
          <button
            @click="detailModal.show = false"
            class="text-gray-500 hover:text-danger text-xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 p-4 bg-gray-50 dark:bg-meta-4 rounded-lg border border-stroke dark:border-strokedark"
        >
          <div>
            <span class="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-0.5"
              >Department / Pengaju:</span
            >
            <span class="text-sm font-bold text-black dark:text-white">
              {{ detailModal.data?.department }} / {{ detailModal.data?.user?.name || 'Unknown' }}
            </span>
          </div>
          <div>
            <span class="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-0.5"
              >General Purpose / Alasan:</span
            >
            <span class="text-sm font-medium text-black dark:text-white block whitespace-pre-line">
              {{ detailModal.data?.purpose || '-' }}
            </span>
          </div>
        </div>

        <div
          class="overflow-x-auto border rounded border-stroke dark:border-strokedark shadow-sm mb-6"
        >
          <table class="w-full border-collapse text-left text-sm text-gray-500 dark:text-gray-400">
            <thead class="bg-gray-100 dark:bg-meta-4 text-black dark:text-white font-semibold">
              <tr class="border-b border-stroke dark:border-strokedark">
                <th class="px-4 py-3 text-center w-12">No</th>
                <th class="px-4 py-3">Deskripsi / Nama Barang</th>
                <th class="px-4 py-3 text-center w-20">Qty</th>
                <th class="px-4 py-3 text-center w-24">Satuan</th>
                <th class="px-4 py-3 text-right w-44">Harga Satuan (IDR)</th>
                <th class="px-4 py-3 text-right w-44">Subtotal (IDR)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stroke dark:divide-strokedark text-black dark:text-white">
              <tr
                v-for="(subItem, index) in detailModal.data?.items"
                :key="subItem.id"
                class="hover:bg-gray-50 dark:hover:bg-meta-4/40"
              >
                <td class="px-4 py-3 text-center font-medium">{{ index + 1 }}</td>
                <td class="px-4 py-3">
                  <div class="font-bold text-black dark:text-white">
                    {{ subItem.item_description }}
                  </div>
                  <div v-if="subItem.item_purpose" class="text-xs text-gray-400 italic mt-0.5">
                    Tujuan khusus: {{ subItem.item_purpose }}
                  </div>
                </td>
                <td class="px-4 py-3 text-center font-bold text-primary dark:text-white">
                  {{ subItem.quantity }}
                </td>
                <td class="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                  {{ subItem.uom?.name || 'pcs' }}
                </td>
                <td class="px-4 py-3 text-right font-medium">
                  {{ formatCurrency(subItem.unit_price) }}
                </td>
                <td class="px-4 py-3 text-right font-bold text-meta-3">
                  {{ formatCurrency(subItem.total_amount) }}
                </td>
              </tr>
              <tr class="bg-gray-100 dark:bg-meta-4 font-bold text-black dark:text-white">
                <td
                  colspan="5"
                  class="px-4 py-4 text-right uppercase tracking-wider text-xs font-semibold"
                >
                  Total Estimasi Anggaran:
                </td>
                <td
                  class="px-4 py-4 text-right text-primary dark:text-meta-3 text-base font-extrabold border-t border-stroke dark:border-strokedark"
                >
                  {{ formatCurrency(detailModal.data?.total_estimated_amount) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="border-t border-stroke pt-5 dark:border-strokedark bg-gray-50/50 dark:bg-meta-4/10 p-5 rounded-lg"
        >
          <h4
            class="text-xs font-bold text-black dark:text-white mb-6 uppercase tracking-wider text-center sm:text-left"
          >
            📋 Alur & Status Persetujuan (Workflow Tracking)
          </h4>

          <div class="relative w-full px-4 py-2">
            <div
              class="absolute top-2.5 left-8 right-8 h-0.5 bg-gray-200 dark:bg-strokedark z-0"
            ></div>

            <div class="flex flex-row justify-between items-start w-full relative z-10">
              <div
                v-for="wfl in detailModal.data?.workflow_approvals"
                :key="wfl.id"
                class="flex flex-col items-center flex-1 relative text-center px-1"
              >
                <span
                  class="flex h-5 w-5 items-center justify-center rounded-full border-2 mb-3 bg-white dark:bg-boxdark mx-auto shadow-sm transition-all duration-300"
                  :class="{
                    'bg-success border-success text-white': wfl.status === 'APPROVED',
                    'bg-danger border-danger text-white': wfl.status === 'REJECTED',
                    'bg-warning border-warning border-dashed scale-110 shadow-md animate-pulse':
                      wfl.status === 'PENDING' &&
                      isCurrentQueue(wfl, detailModal.data?.workflow_approvals),
                    'border-gray-300 text-gray-300 dark:border-form-strokedark':
                      wfl.status === 'PENDING' &&
                      !isCurrentQueue(wfl, detailModal.data?.workflow_approvals),
                  }"
                >
                  <span v-if="wfl.status === 'APPROVED'" class="text-[10px] font-bold">✓</span>
                  <span v-else-if="wfl.status === 'REJECTED'" class="text-[10px] font-bold">✕</span>
                </span>

                <span
                  class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-0.5"
                >
                  Level {{ wfl.level }}
                </span>

                <span class="font-extrabold text-sm block leading-tight px-1 min-h-[20px]">
                  <span
                    v-if="wfl.status === 'APPROVED'"
                    class="text-success"
                    :title="wfl.approver?.name"
                  >
                    {{ wfl.approver?.name }}
                  </span>
                  <span
                    v-else-if="wfl.status === 'REJECTED'"
                    class="text-danger"
                    :title="wfl.approver?.name"
                  >
                    {{ wfl.approver?.name }}
                  </span>
                  <span
                    v-else-if="isCurrentQueue(wfl, detailModal.data?.workflow_approvals)"
                    class="text-warning text-xs font-bold italic animate-pulse"
                  >
                    ⏳ Waiting...
                  </span>
                  <span v-else class="text-gray-300 dark:text-gray-600 text-xs font-normal italic">
                    -
                  </span>
                </span>

                <span
                  class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mt-1"
                >
                  {{ wfl.role?.name || 'Approver' }}
                </span>

                <span v-if="wfl.action_date" class="text-[9px] text-gray-400 mt-1 block">
                  {{ formatDate(wfl.action_date).split(',')[0] }}
                </span>
                <div
                  v-if="wfl.note"
                  class="mt-1 text-[10px] bg-white dark:bg-form-input py-0.5 px-1.5 rounded text-gray-500 max-w-[120px] truncate italic border border-stroke dark:border-strokedark"
                  :title="wfl.note"
                >
                  "{{ wfl.note }}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { API_ENDPOINTS } from '@/api/endpoints'

import { ref, onMounted } from 'vue'
import axios from 'axios'
import PageTitle from '@/Components/common/PageTitle.vue'
import DataTable from '@/Components/Table/DataTable.vue'
import Pagination from '@/Components/Table/Pagination.vue'
import TableEmpty from '@/Components/Table/TableEmpty.vue'
import TableLoading from '@/Components/Table/TableLoading.vue'
import useTable from '@/Composables/useTable'

const inboxData = ref({})
const isFetching = ref(false)
const apiUrl = API_ENDPOINTS.workflowApproval

// State Pengaturan Modal Aksi (Approve/Reject)
const modal = ref({
  show: false,
  type: 'APPROVE',
  item: null,
  note: '',
  level: 1,
  roleName: '',
  loading: false,
})

// State Modal Preview Detail Barang
const detailModal = ref({
  show: false,
  data: null,
})

const toast = ref({ show: false, type: 'success', message: '' })
const showToast = (type, message) => {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

const { search, entries } = useTable({ search: '', entries: 10 }, () => fetchInbox())

const formatCurrency = (value) => {
  if (!value || value == 0) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const fetchInbox = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
      headers: { Authorization: `Bearer ${token}` },
    })
    inboxData.value = response.data.data
  } catch (error) {
    showToast('danger', 'Gagal memuat master data dropdown dari server.')
  } finally {
    isFetching.value = false
  }
}

const openDetailModal = (approvableData) => {
  detailModal.value = {
    show: true,
    data: approvableData,
  }
}

const openActionModal = (item, type) => {
  modal.value = {
    show: true,
    type: type,
    item: item,
    note: '',
    level: item.level,
    roleName: item.role?.name || 'Approver',
    loading: false,
  }
}

// Logika pembantu untuk melacak level mana yang sedang memegang antrean aktif
const isCurrentQueue = (currentWfl, allWfls) => {
  if (currentWfl.status !== 'PENDING') return false
  const standardActive = allWfls.find((w) => w.status === 'PENDING')
  return standardActive && standardActive.id === currentWfl.id
}

const executeAction = async () => {
  modal.value.loading = true
  const id = modal.value.item.id
  const actionPath = modal.value.type === 'APPROVE' ? 'approve' : 'reject'

  try {
    const token = localStorage.getItem('token')
    const response = await axios.post(
      `${apiUrl}/${id}/${actionPath}`,
      { note: modal.value.note },
      { headers: { Authorization: `Bearer ${token}` } },
    )

    // toast.success(response.data.message || 'Transaksi berhasil diproses!')
    showToast('success', 'Approval berhasil dieksekusi.')
    modal.value.show = false
    fetchInbox()
  } catch (error) {
    const msg = error.response?.data?.message || 'Gagal mengeksekusi approval.'
    showToast('danger', msg)
  } finally {
    modal.value.loading = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => fetchInbox())
</script>

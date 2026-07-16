<template>
  <div class="mx-auto max-w-screen-2xl relative">
    <Breadcrumb pageTitle="Purchase Order" :crumbs="['Operations', 'Procurement']" />

    <DataTable
      :headers="[
        'PO Number',
        'PR Number',
        'Vendor',
        'Department',
        'Grand Total',
        'Status',
        'Action',
      ]"
      :from="poData.from"
      :to="poData.to"
      :total="poData.total"
      :search="search"
      :entries="entries"
      @search="search = $event"
      @update:entries="entries = $event"
    >
      <template #top-actions>
        <button class="rounded bg-primary py-2 px-4 text-sm font-medium text-white">
          Create Manual PO
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="7" />

      <tr
        v-else
        v-for="po in poData.data"
        :key="po.id"
        class="border-b border-stroke hover:bg-gray-50"
      >
        <td class="border-r px-4 py-5 text-center font-bold text-primary">
          {{ po.po_number }}
        </td>

        <td class="border-r px-4 py-5 text-center">
          {{ po.purchase_request?.request_number }}
        </td>

        <td class="border-r px-4 py-5 text-center">
          {{ po.vendor?.name }}
        </td>

        <td class="border-r px-4 py-5 text-center">
          {{ po.department?.name }}
        </td>

        <td class="border-r px-4 py-5 text-right">
          {{ formatCurrency(po.grand_total) }}
        </td>

        <td class="border-r px-4 py-5 text-center">
          <span
            class="inline-block rounded px-2.5 py-0.5 text-sm font-medium"
            :class="{
              'bg-warning/20 text-warning': po.status === 'DRAFT',
              'bg-primary/20 text-primary': po.status === 'SENT',
              'bg-orange-100 text-orange-600': po.status === 'PARTIAL_RECEIVED',
              'bg-success/20 text-success': po.status === 'RECEIVED',
              'bg-danger/20 text-danger': po.status === 'CANCELLED',
            }"
          >
            {{ po.status }}
          </span>
        </td>

        <td class="border-r border-stroke px-4 py-5 text-center">
          <div class="flex items-center justify-center gap-3">
            <!-- DETAIL -->
            <button
              @click="openDetailModal(po.id)"
              class="text-gray-500 hover:text-primary"
              title="View Detail"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
            </button>

            <!-- PRINT -->
            <button
              @click="printPO(po.id)"
              class="text-gray-500 hover:text-primary"
              title="Print PO"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2zm5-17V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3"
                ></path>
              </svg>
            </button>

            <!-- SEND TO VENDOR -->
            <button
              v-if="po.status === 'DRAFT'"
              @click="sendPO(po.id)"
              class="text-gray-500 hover:text-primary"
              title="Send PO"
            >
              <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" hover="text-primary">
                <path
                  d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
                  stroke="gray"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <!-- EDIT -->
            <button
              v-if="po.status === 'DRAFT'"
              @click="
                $router.push({
                  name: 'opt_purchase_order.edit',
                  params: { id: po.id },
                })
              "
              class="text-gray-500 hover:text-primary"
              title="Edit"
            >
              ✏️
            </button>

            <!-- DELETE -->
            <button
              v-if="po.status === 'DRAFT'"
              @click="openDeleteModal(po.id)"
              class="text-gray-500 hover:text-danger"
              title="Delete"
            >
              🗑️
            </button>

            <span v-if="po.status !== 'DRAFT'" class="text-xs text-gray-400 italic"> Locked </span>
          </div>
        </td>
      </tr>

      <TableEmpty v-if="!isFetching && (!poData.data || poData.data.length === 0)" :colspan="7" />

      <template #pagination>
        <Pagination :links="poData.links" @change-page="fetchPO" />
      </template>
    </DataTable>

    <PurchaseOrderDetailModal
      :show="showDetailModal"
      :purchase-order="selectedPO"
      @close="showDetailModal = false"
    />
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
import PurchaseOrderDetailModal from './components/DetailModal.vue'

import useTable from '@/Composables/useTable'
import { API_ENDPOINTS } from '@/api/endpoints'

const poData = ref({})
const isFetching = ref(false)

const showDetailModal = ref(false)
const selectedPO = ref({})

const apiUrl = API_ENDPOINTS.optPurchaseOrder

const { search, entries } = useTable(
  {
    search: '',
    entries: 10,
  },
  () => fetchPO(),
)

const fetchPO = async (url = apiUrl) => {
  isFetching.value = true

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

    poData.value = response.data.data
  } catch (err) {
    console.log(err)
  } finally {
    isFetching.value = false
  }
}

const openDetailModal = async (id) => {
  const token = localStorage.getItem('token')

  const response = await axios.get(`${apiUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  selectedPO.value = response.data.data
  showDetailModal.value = true
}

const printPO = (id) => {
  window.open(`${apiUrl}/${id}/print`)
}

const sendPO = async (id) => {
  const token = localStorage.getItem('token')

  await axios.post(
    `${apiUrl}/${id}/send`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  fetchPO()
}

const formatCurrency = (value) => {
  if (!value) return 'Rp 0'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

onMounted(() => {
  fetchPO()
})
</script>

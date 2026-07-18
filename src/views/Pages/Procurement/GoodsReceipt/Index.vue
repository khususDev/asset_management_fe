<template>
    <div class="mx-auto max-w-screen-2xl">
        <div v-if="toast.show"
            class="fixed top-5 right-5 z-99999 flex w-full max-w-sm rounded-lg border bg-white p-4 shadow-xl dark:bg-boxdark"
            :class="toast.type === 'success'
                ? 'border-success bg-success/5'
                : 'border-danger bg-danger/5'
                ">
            <div class="mr-3 flex h-5 w-5 items-center justify-center rounded-full text-white"
                :class="toast.type === 'success' ? 'bg-success' : 'bg-danger'">
                <span class="text-xs font-bold">{{
                    toast.type === "success" ? "✓" : "✕"
                    }}</span>
            </div>
            <div>
                <h5 class="font-semibold text-black dark:text-white text-sm">
                    {{ toast.type === "success" ? "Sukses" : "Gagal" }}
                </h5>
                <p class="text-xs text-gray-500 mt-0.5">{{ toast.message }}</p>
            </div>
        </div>
        <Breadcrumb pageTitle="Goods Receipt" :crumbs="['Operations', 'Procurement']" />

        <DataTable :headers="[
            'GR Number',
            'Receipt Date',
            'PO Number',
            'Vendor',
            'Status',
            'Action'
        ]" :from="grData.from" :to="grData.to" :total="grData.total" :search="search" :entries="entries"
            @search="search = $event" @update:entries="entries = $event">

            <template #top-actions>
                <button @click="$router.push({
                    name: 'opt_goods_receipt.create'
                })" class="rounded bg-primary py-2 px-4 text-white">
                    Create Goods Receipt
                </button>
            </template>

            <tr v-for="gr in grData.data" :key="gr.id" class="border-b">
                <td class="p-4 text-center">
                    {{ gr.gr_number }}
                </td>

                <td class="p-4 text-center">
                    {{ gr.receipt_date }}
                </td>

                <td class="p-4 text-center">
                    {{ gr.purchase_order?.po_number }}
                </td>

                <td class="p-4 text-center">
                    {{ gr.purchase_order?.vendor?.name }}
                </td>

                <td class="p-4 text-center">
                    {{ gr.status }}
                </td>

                <td class="p-4 text-center">

                    <button @click="view(gr.id)" class="mr-3">
                        View
                        <DetailModal :show="showDetailModal" :goods-receipt="selectedGR"
                            @close="showDetailModal = false" />
                    </button>

                    <button v-if="gr.status == 'DRAFT'" @click="postGR(gr.id)">
                        Post
                    </button>

                    <button @click="printGR(gr.id)" class="mr-3">
                        Print
                    </button>

                </td>
            </tr>

        </DataTable>

    </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import DataTable from '@/Components/Table/DataTable.vue'
import { API_ENDPOINTS } from '@/api/endpoints'
import useTable from '@/Composables/useTable'
import DetailModal from './components/DetailModal.vue'

const showDetailModal = ref(false)
const selectedGR = ref({})

const apiUrl =
    API_ENDPOINTS.optGoodsReceipt

const grData = ref({})
const isFetching = ref(false)


// State Toast Kustom
const toast = ref({ show: false, type: "success", message: "" });
const showToast = (type, message) => {
    toast.value = { show: true, type, message };
    setTimeout(() => {
        toast.value.show = false;
    }, 4000);
};

const { search, entries } =
    useTable(
        {
            search: '',
            entries: 10,
        },
        () => fetchData()
    )

const fetchData = async (
    url = apiUrl
) => {
    const token =
        localStorage.getItem('token')

    const response =
        await axios.get(
            url,
            {
                params: {
                    search: search.value,
                    entries: entries.value,
                },
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        )

    grData.value =
        response.data.data
}

const printGR = async (id) => {
    const token =
        localStorage.getItem('token')

    const response =
        await axios.get(
            `${apiUrl}/${id}/print`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        )

    const printWindow =
        window.open('', '_blank')

    printWindow.document.write(
        response.data
    )

    printWindow.document.close()
}

const openDetailModal = async (id) => {
    const token =
        localStorage.getItem('token')

    const response =
        await axios.get(
            `${apiUrl}/${id}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        )

    selectedGR.value =
        response.data.data

    showDetailModal.value = true
}

const postGR = async (id) => {
    const token =
        localStorage.getItem('token')

    await axios.post(
        `${apiUrl}/${id}/post`,
        {},
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    )

    fetchData()
}

onMounted(() => {
    fetchData()
})
</script>
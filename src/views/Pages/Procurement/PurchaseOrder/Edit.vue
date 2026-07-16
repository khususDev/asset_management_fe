<template>
    <div class="mx-auto max-w-screen-2xl">

        <Breadcrumb pageTitle="Edit Purchase Order" :crumbs="['Operations', 'Procurement']" />

        <div class="rounded-lg bg-white shadow">

            <div class="border-b px-6 py-4">
                <h3 class="text-xl font-bold">
                    Edit Purchase Order
                </h3>
            </div>

            <div v-if="loading" class="p-6">
                Loading...
            </div>

            <div v-else class="p-6">
                <!-- HEADER -->

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="mb-2 block text-sm font-medium">
                            PO Number
                        </label>

                        <input v-model="form.po_number" disabled class="w-full rounded border p-3 bg-gray-100" />
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium">
                            Vendor
                        </label>

                        <input :value="form.vendor?.name" disabled class="w-full rounded border p-3 bg-gray-100" />
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium">
                            Purchase Request
                        </label>

                        <input :value="form.purchase_request?.request_number
                            " disabled class="w-full rounded border p-3 bg-gray-100" />
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium">
                            Department
                        </label>

                        <input :value="form.department?.name
                            " disabled class="w-full rounded border p-3 bg-gray-100" />
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium">
                            Order Date
                        </label>

                        <input type="date" v-model="form.order_date" class="w-full rounded border p-3" />
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium">
                            Expected Delivery
                        </label>

                        <input type="date" v-model="form.expected_delivery_date" class="w-full rounded border p-3" />
                    </div>
                </div>

                <!-- ITEMS -->

                <div class="mt-10">

                    <h4 class="mb-4 text-lg font-bold">
                        Purchase Order Items
                    </h4>

                    <div class="overflow-x-auto rounded border">
                        <table class="w-full">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="p-3 text-left">
                                        Description
                                    </th>

                                    <th class="p-3 text-center">
                                        Qty
                                    </th>

                                    <th class="p-3 text-center">
                                        UOM
                                    </th>

                                    <th class="p-3 text-right">
                                        Unit Price
                                    </th>

                                    <th class="p-3 text-right">
                                        Amount
                                    </th>

                                    <th class="p-3 text-center">
                                        Tax
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr v-for="item in form.items" :key="item.id" class="border-t">
                                    <td class="p-3">
                                        <input v-model="item.item_description" class="w-full rounded border p-2" />
                                    </td>

                                    <td class="p-3">
                                        <input type="number" v-model="item.quantity" class="w-24 rounded border p-2" />
                                    </td>

                                    <td class="p-3">
                                        {{ item.uom?.name }}
                                    </td>

                                    <td class="p-3">
                                        <input type="number" v-model="item.unit_price"
                                            class="w-full rounded border p-2 text-right" />
                                    </td>

                                    <td class="p-3 text-right font-bold">
                                        {{
                                            formatCurrency(
                                                item.quantity *
                                                item.unit_price
                                            )
                                        }}
                                    </td>

                                    <td class="p-3 text-center">
                                        <span class="rounded px-2 py-1 text-xs" :class="item.is_pkp
                                            ? 'bg-success/20 text-success'
                                            : 'bg-gray-100'
                                            ">
                                            {{
                                                item.is_pkp
                                                    ? 'PKP'
                                                    : 'NON PKP'
                                            }}
                                        </span>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- REMARKS -->

                <div class="mt-8">
                    <label class="mb-2 block font-medium">
                        Remarks
                    </label>

                    <textarea v-model="form.remarks" rows="4" class="w-full rounded border p-3" />
                </div>

                <!-- SUMMARY -->

                <div class="mt-8 flex justify-end">
                    <div class="w-full md:w-96 rounded border p-5">
                        <div class="flex justify-between mb-2">
                            <span>Subtotal</span>

                            <span>
                                {{
                                    formatCurrency(subtotal)
                                }}
                            </span>
                        </div>

                        <div class="flex justify-between mb-2">
                            <span>PPN</span>

                            <span>
                                {{
                                    formatCurrency(ppn)
                                }}
                            </span>
                        </div>

                        <div class="border-t pt-3 flex justify-between text-lg font-bold">
                            <span>Grand Total</span>

                            <span>
                                {{
                                    formatCurrency(
                                        subtotal + ppn
                                    )
                                }}
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            <!-- FOOTER -->

            <div class="sticky bottom-0 border-t bg-white px-6 py-4 flex justify-end gap-3">
                <button @click="$router.back()" class="rounded border px-5 py-2">
                    Cancel
                </button>

                <button @click="save" class="rounded bg-primary px-6 py-2 text-white">
                    Save Changes
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import { API_ENDPOINTS } from '@/api/endpoints'

const route = useRoute()
const router = useRouter()

const apiUrl =
    API_ENDPOINTS.optPurchaseOrder

const loading = ref(true)

const form = ref({
    items: []
})

const subtotal = computed(() => {
    return form.value.items.reduce(
        (t, i) =>
            t +
            (i.quantity * i.unit_price),
        0
    )
})

const ppn = computed(() => {
    return form.value.items.reduce(
        (t, i) => {
            if (!i.is_pkp) return t

            return (
                t +
                (
                    i.quantity *
                    i.unit_price *
                    11 /
                    100
                )
            )
        },
        0
    )
})

const loadData = async () => {
    const token =
        localStorage.getItem('token')

    const response =
        await axios.get(
            `${apiUrl}/${route.params.id}/edit`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        )

    form.value =
        response.data.data

    loading.value = false
}

const save = async () => {
    const token =
        localStorage.getItem('token')

    await axios.put(
        `${apiUrl}/${route.params.id}`,
        form.value,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    )

    router.push({
        name: 'opt_purchase_order'
    })
}

const formatCurrency = (v) => {
    return new Intl.NumberFormat(
        'id-ID',
        {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }
    ).format(v || 0)
}

onMounted(() => {
    loadData()
})
</script>
<template>
    <div class="mx-auto max-w-screen-2xl">

        <div v-if="toast.show"
            class="fixed top-5 right-5 z-99999 flex w-full max-w-sm rounded-lg border bg-white p-4 shadow-xl dark:bg-boxdark"
            :class="toast.type === 'success' ? 'border-success bg-success/5' : 'border-danger bg-danger/5'
                ">
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

        <Breadcrumb pageTitle="Create Goods Receipt" :crumbs="['Operations', 'Procurement']" />

        <div class="rounded-lg border border-stroke bg-white shadow-default">

            <!-- HEADER -->

            <div class="border-b px-6 py-5">

                <h3 class="text-xl font-semibold">
                    Goods Receipt
                </h3>

            </div>

            <div class="p-6">

                <div class="grid grid-cols-2 gap-6">

                    <!-- LEFT -->

                    <div>

                        <label class="mb-2 block text-sm font-medium">
                            Purchase Order
                        </label>

                        <select v-model="form.purchase_order_id" @change="selectPO"
                            class="w-full rounded border border-stroke px-4 py-3">

                            <option value="">
                                Select Purchase Order
                            </option>

                            <option v-for="po in purchaseOrders" :key="po.id" :value="po.id">
                                {{ po.po_number }}
                            </option>

                        </select>

                    </div>

                    <!-- RIGHT -->

                    <div>

                        <label class="mb-2 block text-sm font-medium">
                            Receipt Date
                        </label>

                        <input type="date" v-model="form.receipt_date"
                            class="w-full rounded border border-stroke px-4 py-3">

                    </div>

                </div>

                <!-- PO INFORMATION -->

                <div v-if="selectedPO" class="mt-8 rounded border border-stroke bg-slate-50">

                    <div class="border-b px-5 py-3">

                        <h4 class="font-semibold">

                            Purchase Order Information

                        </h4>

                    </div>

                    <div class="grid grid-cols-2 gap-8 p-5">

                        <div>

                            <table class="w-full">

                                <tr>

                                    <td class="w-40 py-2 font-medium">
                                        Vendor
                                    </td>

                                    <td>

                                        {{ selectedPO.vendor?.name }}

                                    </td>

                                </tr>

                                <tr>

                                    <td class="py-2 font-medium">
                                        Address
                                    </td>

                                    <td>

                                        {{ selectedPO.vendor?.address }}

                                    </td>

                                </tr>

                                <tr>

                                    <td class="py-2 font-medium">
                                        Contact
                                    </td>

                                    <td>

                                        {{ selectedPO.vendor?.contact_person }}

                                    </td>

                                </tr>

                                <tr>

                                    <td class="py-2 font-medium">
                                        Phone
                                    </td>

                                    <td>

                                        {{ selectedPO.vendor?.phone }}

                                    </td>

                                </tr>

                            </table>

                        </div>

                        <div>

                            <table class="w-full">

                                <tr>

                                    <td class="w-40 py-2 font-medium">
                                        PO Number
                                    </td>

                                    <td>

                                        {{ selectedPO.po_number }}

                                    </td>

                                </tr>

                                <tr>

                                    <td class="py-2 font-medium">
                                        PO Date
                                    </td>

                                    <td>

                                        {{ selectedPO.order_date }}

                                    </td>

                                </tr>

                                <tr>

                                    <td class="py-2 font-medium">
                                        Expected Delivery
                                    </td>

                                    <td>

                                        {{ selectedPO.expected_delivery_date }}

                                    </td>

                                </tr>

                                <tr>

                                    <td class="py-2 font-medium">
                                        Department
                                    </td>

                                    <td>

                                        {{ selectedPO.department?.name }}

                                    </td>

                                </tr>

                            </table>

                        </div>

                    </div>

                </div>

                <!-- ITEM TABLE -->

                <div v-if="form.items.length" class="mt-8 overflow-x-auto rounded border border-stroke">

                    <table class="w-full">

                        <thead class="bg-slate-100">

                            <tr>

                                <th class="border p-3">
                                    No
                                </th>

                                <th class="border p-3 text-left">
                                    Item Description
                                </th>

                                <th class="border p-3">
                                    UOM
                                </th>

                                <th class="border p-3">
                                    PO Qty
                                </th>

                                <th class="border p-3">
                                    Outstanding
                                </th>

                                <th class="border p-3">
                                    Receive
                                </th>

                                <th class="border p-3">
                                    Good
                                </th>

                                <th class="border p-3">
                                    Reject
                                </th>

                                <th class="border p-3">
                                    Remark
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr v-for="(item, index) in form.items" :key="item.purchase_order_item_id">

                                <td class="border p-3 text-center">
                                    {{ index + 1 }}
                                </td>

                                <td class="border p-3">
                                    <div class="font-medium">
                                        {{ item.item_description }}
                                    </div>

                                    <div class="mt-1 text-xs text-gray-500">
                                        {{ item.item_purpose }}
                                    </div>
                                </td>

                                <td class="border p-3 text-center">
                                    {{ item.uom }}
                                </td>

                                <td class="border p-3 text-center">
                                    {{ item.ordered_qty }}
                                </td>

                                <td class="border p-3 text-center font-semibold text-primary">
                                    {{ item.outstanding_qty }}
                                </td>

                                <!-- Received Qty -->
                                <td class="border p-3 text-center bg-gray-50">
                                    {{ item.received_qty }}
                                </td>

                                <!-- Good Qty -->
                                <td class="border p-2">

                                    <input type="number" min="0" :max="item.outstanding_qty"
                                        v-model.number="item.accepted_qty" @input="qtyChanged(item)"
                                        class="w-24 rounded border px-2 py-2 text-center">

                                </td>

                                <!-- Reject Qty -->
                                <td class="border p-2">

                                    <input type="number" min="0" :max="item.outstanding_qty"
                                        v-model.number="item.rejected_qty" @input="qtyChanged(item)"
                                        class="w-24 rounded border px-2 py-2 text-center">

                                </td>

                                <td class="border p-2">

                                    <input type="text" v-model="item.remarks" class="w-full rounded border px-3 py-2"
                                        placeholder="Remark...">

                                </td>

                            </tr>

                            <!-- Tidak ada item -->
                            <tr v-if="form.items.length === 0">

                                <td colspan="9" class="border py-8 text-center text-gray-500">
                                    Please select Purchase Order first.
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

                <!-- FOOTER -->

                <div v-if="form.items.length" class="mt-8 rounded border border-stroke">

                    <div class="grid grid-cols-2 gap-8 p-6">

                        <div>

                            <label class="mb-2 block font-medium">
                                Receipt Notes
                            </label>

                            <textarea v-model="form.remarks" rows="5" class="w-full rounded border border-stroke p-3"
                                placeholder="Write receipt notes..." />

                        </div>

                        <div>

                            <label class="mb-3 block font-medium">
                                Receipt Status
                            </label>

                            <div class="space-y-3">

                                <label class="flex items-center gap-3">

                                    <input type="radio" value="PARTIAL" v-model="form.receipt_status">

                                    Partial Receipt

                                </label>

                                <label class="flex items-center gap-3">

                                    <input type="radio" value="COMPLETE" v-model="form.receipt_status">

                                    Complete Receipt

                                </label>

                            </div>

                        </div>

                    </div>

                    <div class="flex justify-end gap-3 border-t p-5">

                        <button type="button" @click="$router.back()" class="rounded border border-stroke px-6 py-2">
                            Cancel
                        </button>

                        <ButtonLoading text="Save Goods Receipt" loadingText="Saving Goods Receipt..."
                            :loading="loading" @click="save" class="rounded bg-primary px-6 py-2 text-white" />

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>
<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import { API_ENDPOINTS } from '@/api/endpoints'
import ButtonLoading from '@/components/Common/ButtonLoading.vue'

const router = useRouter()

const apiUrl = API_ENDPOINTS.optGoodsReceipt

const purchaseOrders = ref([])

const selectedPO = ref(null)

const loading = ref(false)

const form = ref({
    purchase_order_id: '',
    receipt_date: new Date().toISOString().substring(0, 10),
    receipt_status: 'PARTIAL',
    remarks: '',
    items: [],
})

const toast = ref({ show: false, type: 'success', message: '' })
const showToast = (type, message) => {
    toast.value = { show: true, type, message }
    setTimeout(() => {
        toast.value.show = false
    }, 4000)
}

const loadPO = async () => {

    try {

        const token =
            localStorage.getItem('token')

        const response =
            await axios.get(
                `${apiUrl}/get-po`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

        purchaseOrders.value =
            response.data.data

    } catch (err) {

        console.log(err)

    }

}

const selectPO = () => {
    const po =
        purchaseOrders.value.find(
            p =>
                p.id ==
                form.value.purchase_order_id
        )
    if (!po) {
        selectedPO.value = null
        form.value.items = []
        return
    }
    selectedPO.value = po
    form.value.items = po.items.map(item => ({
        purchase_order_item_id: item.id,
        item_description: item.item_description,
        uom: item.uom?.name,
        ordered_qty: item.quantity,
        received_before_qty:
            item.quantity - item.outstanding_qty,
        outstanding_qty:
            item.outstanding_qty,
        received_qty:
            item.outstanding_qty,
        accepted_qty:
            item.outstanding_qty,
        rejected_qty: 0,
        replacement_qty: 0,
        remarks: ''

    }))

}

const qtyChanged = (item) => {

    item.accepted_qty = Number(item.accepted_qty) || 0
    item.rejected_qty = Number(item.rejected_qty) || 0

    if (item.accepted_qty < 0)
        item.accepted_qty = 0

    if (item.rejected_qty < 0)
        item.rejected_qty = 0

    const total =
        item.accepted_qty +
        item.rejected_qty

    if (total > item.outstanding_qty) {

        item.accepted_qty =
            item.outstanding_qty -
            item.rejected_qty

        if (item.accepted_qty < 0)
            item.accepted_qty = 0
    }

    item.received_qty =
        Number(item.accepted_qty) +
        Number(item.rejected_qty)
}

const validateItems = () => {

    for (const item of form.value.items) {

        item.received_qty =
            Number(item.received_qty)

        item.accepted_qty =
            Number(item.accepted_qty)

        item.rejected_qty =
            Number(item.rejected_qty)

        if (
            item.received_qty >
            item.outstanding_qty
        ) {

            alert(
                `${item.item_description}\nReceive Qty melebihi Outstanding Qty`
            )

            return false

        }

        if (
            item.accepted_qty +
            item.rejected_qty !=
            item.received_qty
        ) {

            alert(
                `${item.item_description}\nAccepted + Reject harus sama dengan Receive Qty`
            )

            return false

        }

    }

    return true

}

const save = async () => {

    if (!validateItems()) return

    if (loading.value) return

    loading.value = true

    try {

        const token = localStorage.getItem('token')

        const response = await axios.post(
            apiUrl,
            form.value,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        showToast(
            'success',
            response.data.message
        )

        setTimeout(() => {

            router.push({
                name: 'opt_goods_receipt'
            })

        }, 1500)

    } catch (err) {

        showToast(
            'danger',
            err.response?.data?.message ??
            'Terjadi kesalahan.'
        )

    } finally {

        loading.value = false

    }

}

onMounted(() => {

    loadPO()

})
</script>
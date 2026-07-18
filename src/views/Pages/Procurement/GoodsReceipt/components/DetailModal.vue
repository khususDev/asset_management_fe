<template>
    <div v-if="show" class="fixed inset-0 z-99999 flex items-center justify-center bg-black/50">
        <div class="bg-white rounded-lg w-[1100px] max-h-[90vh] overflow-y-auto p-6">
            <div class="flex justify-between mb-6">
                <h3 class="text-xl font-bold">
                    Goods Receipt Detail
                </h3>

                <button @click="$emit('close')" class="text-gray-500 hover:text-danger">
                    ✕
                </button>
            </div>

            <!-- HEADER -->

            <div class="grid grid-cols-2 gap-6 mb-8">

                <div>
                    <div class="text-xs text-gray-500">
                        GR Number
                    </div>

                    <div class="font-semibold">
                        {{ goodsReceipt.gr_number }}
                    </div>
                </div>

                <div>
                    <div class="text-xs text-gray-500">
                        Receipt Date
                    </div>

                    <div class="font-semibold">
                        {{ goodsReceipt.receipt_date }}
                    </div>
                </div>

                <div>
                    <div class="text-xs text-gray-500">
                        PO Number
                    </div>

                    <div class="font-semibold">
                        {{ goodsReceipt.purchase_order?.po_number }}
                    </div>
                </div>

                <div>
                    <div class="text-xs text-gray-500">
                        Vendor
                    </div>

                    <div class="font-semibold">
                        {{ goodsReceipt.purchase_order?.vendor?.name }}
                    </div>
                </div>

                <div>
                    <div class="text-xs text-gray-500">
                        Status
                    </div>

                    <div class="font-semibold">
                        {{ goodsReceipt.status }}
                    </div>
                </div>

            </div>

            <!-- ITEMS -->

            <table class="w-full border">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="border p-2">
                            Description
                        </th>

                        <th class="border p-2">
                            Received
                        </th>

                        <th class="border p-2">
                            Accepted
                        </th>

                        <th class="border p-2">
                            Rejected
                        </th>

                        <th class="border p-2">
                            Reason
                        </th>
                        <th class="border p-2">
                            Outstanding
                        </th>
                    </tr>
                </thead>

                <tbody>

                    <tr v-for="item in goodsReceipt.items" :key="item.id">
                        <td class="border p-2">
                            {{ item.purchase_order_item?.item_description }}
                        </td>

                        <td class="border p-2 text-center">
                            {{ item.received_qty }}
                        </td>

                        <td class="border p-2 text-center">
                            {{ item.accepted_qty }}
                        </td>

                        <td class="border p-2 text-center">
                            {{ item.rejected_qty }}
                        </td>

                        <td class="border p-2">
                            {{ item.reject_reason }}
                        </td>

                        <td>
                            {{ item.purchase_order_item?.outstanding_qty }}
                        </td>
                    </tr>

                </tbody>
            </table>

            <div class="mt-8 flex justify-end">
                <button @click="$emit('close')" class="border rounded px-5 py-2">
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    show: Boolean,
    goodsReceipt: {
        type: Object,
        default: () => ({})
    }
})
</script>
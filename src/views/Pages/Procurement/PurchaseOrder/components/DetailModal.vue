<template>
  <div v-if="show" class="fixed inset-0 z-99999 flex items-center justify-center bg-black/50">
    <div class="bg-white rounded-lg w-[1000px] max-h-[90vh] overflow-y-auto p-6">
      <!-- Header -->
      <div class="flex justify-between mb-6">
        <h3 class="text-xl font-bold">Purchase Order Detail</h3>

        <button @click="$emit('close')" class="text-gray-500 hover:text-danger">✕</button>
      </div>

      <!-- Informasi Header PO -->
      <div class="grid grid-cols-2 gap-6 mb-8">
        <div>
          <div class="text-xs text-gray-500">PO Number</div>

          <div class="font-semibold">
            {{ purchaseOrder.po_number }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-500">PO Date</div>

          <div class="font-semibold">
            {{ formatDate(purchaseOrder.po_date) }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-500">Purchase Request</div>

          <div class="font-semibold">
            {{ purchaseOrder.purchase_request?.request_number }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-500">Vendor</div>

          <div class="font-semibold">
            {{ purchaseOrder.vendor?.name }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-500">Department</div>

          <div class="font-semibold">
            {{ purchaseOrder.department?.name }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-500">Status</div>

          <div>
            <span class="inline-block rounded px-3 py-1 text-sm" :class="statusClass">
              {{ purchaseOrder.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Detail Item -->
      <h4 class="font-bold text-lg mb-3">Purchase Order Items</h4>

      <table class="w-full border mb-6">
        <thead class="bg-gray-100">
          <tr>
            <th class="border p-2">Description</th>
            <th class="border p-2">Qty</th>
            <th class="border p-2">UOM</th>
            <th class="border p-2">Delivery</th>
            <th class="border p-2">Unit Price</th>
            <th class="border p-2">Amount</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in purchaseOrder.items" :key="item.id">
            <td class="border p-2">
              {{ item.item_description }}
            </td>

            <td class="border p-2 text-center">
              {{ item.quantity }}
            </td>

            <td class="border p-2 text-center">
              {{ item.uom?.name }}
            </td>

            <td class="border p-2">
              {{ item.deliveryBranch?.name }}
            </td>

            <td class="border p-2 text-right">
              {{ formatCurrency(item.unit_price) }}
            </td>

            <td class="border p-2 text-right">
              {{ formatCurrency(item.total_amount) }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Summary -->
      <div class="flex justify-end">
        <div class="w-[350px]">
          <div class="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>
              {{ formatCurrency(purchaseOrder.subtotal) }}
            </span>
          </div>

          <div class="flex justify-between mb-2">
            <span>PPN</span>
            <span>
              {{ formatCurrency(purchaseOrder.ppn_amount) }}
            </span>
          </div>

          <div class="flex justify-between border-t pt-3 font-bold text-lg">
            <span>Grand Total</span>
            <span>
              {{ formatCurrency(purchaseOrder.grand_total) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 flex justify-end">
        <button @click="$emit('close')" class="px-5 py-2 rounded border">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: Boolean,
  purchaseOrder: {
    type: Object,
    default: () => ({}),
  },
})

const formatCurrency = (value) => {
  if (!value) return 'Rp 0'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const formatDate = (value) => {
  if (!value) return '-'

  return new Date(value).toLocaleDateString('id-ID')
}

const statusClass = computed(() => {
  switch (props.purchaseOrder.status) {
    case 'DRAFT':
      return 'bg-warning/20 text-warning'

    case 'SENT':
      return 'bg-primary/20 text-primary'

    case 'PARTIAL_RECEIVED':
      return 'bg-orange-100 text-orange-600'

    case 'RECEIVED':
      return 'bg-success/20 text-success'

    case 'CANCELLED':
      return 'bg-danger/20 text-danger'

    default:
      return 'bg-gray-100 text-gray-500'
  }
})
</script>

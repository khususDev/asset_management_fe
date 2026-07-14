<template>
  <div v-if="show" class="fixed inset-0 z-99999 flex items-center justify-center bg-black/50">
    <div class="bg-white rounded-lg w-[900px] max-h-[90vh] overflow-y-auto p-6">
      <div class="flex justify-between mb-5">
        <h3 class="text-xl font-bold">Purchase Request Detail</h3>

        <button @click="$emit('close')" class="text-gray-500">✕</button>
      </div>

      <div class="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div class="text-xs text-gray-500">PR Number</div>
          <div class="font-semibold">
            {{ request.request_number }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-500">Department</div>
          <div class="font-semibold">
            {{ request.department?.name }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-500">Purpose</div>
          <div class="font-semibold">
            {{ request.purpose }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-500">Status</div>
          <div class="font-semibold">
            {{ request.status }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-500">Approval Method</div>
          <div class="font-semibold">
            {{ request.approval_method }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-500">Created By</div>
          <div class="font-semibold">
            {{ request.user?.name }}
          </div>
        </div>
      </div>

      <table class="w-full border">
        <thead class="bg-gray-100">
          <tr>
            <th class="border p-2">Description</th>
            <th class="border p-2">Qty</th>
            <th class="border p-2">UOM</th>
            <th class="border p-2">Vendor</th>
            <th class="border p-2">Amount</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in request.items" :key="item.id">
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
              {{ item.vendor?.name }}
            </td>

            <td class="border p-2 text-right">
              {{ formatCurrency(item.total_amount) }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="request.workflow_approvals?.length" class="mt-8">
        <h4 class="text-lg font-bold mb-4">Approval Timeline</h4>

        <div
          v-for="approval in request.workflow_approvals"
          :key="approval.id"
          class="border rounded-lg p-4 mb-3"
        >
          <div class="flex justify-between items-start">
            <div>
              <div class="font-semibold">Level {{ approval.level }}</div>

              <div class="text-sm text-gray-500">
                {{ approval.role?.name }}
              </div>

              <div class="text-sm text-gray-700">
                {{ approval.approver?.name || '-' }}
              </div>

              <div v-if="approval.action_date" class="text-xs text-gray-400 mt-1">
                {{ new Date(approval.action_date).toLocaleString('id-ID') }}
              </div>
            </div>

            <span
              class="px-3 py-1 rounded text-xs font-semibold"
              :class="{
                'bg-success/20 text-success': approval.status === 'APPROVED',

                'bg-danger/20 text-danger': approval.status === 'REJECTED',

                'bg-warning/20 text-warning': approval.status === 'PENDING',
              }"
            >
              {{ approval.status }}
            </span>
          </div>

          <div v-if="approval.note" class="mt-2 text-sm text-gray-500 italic">
            {{ approval.note }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  request: {
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
</script>

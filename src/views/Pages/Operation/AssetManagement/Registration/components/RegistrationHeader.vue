<template>
  <div
    class="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-5 dark:border-primary dark:bg-meta-4"
  >
    <div class="flex flex-col justify-between gap-5 lg:flex-row">
      <!-- Left -->
      <div class="flex-1">
        <div class="mb-2 flex items-center gap-2">
          <span
            class="rounded bg-primary px-2 py-1 text-xs font-bold uppercase tracking-wider text-white"
          >
            {{ asset.asset?.class }}
          </span>

          <span class="rounded bg-success/20 px-2 py-1 text-xs font-semibold text-success">
            {{ asset.asset?.status }}
          </span>
        </div>

        <h2 class="text-2xl font-bold text-black dark:text-white">
          {{ asset.asset?.name }}
        </h2>

        <p class="mt-1 text-sm text-gray-500">Asset Registration</p>
      </div>

      <!-- Right -->
      <div class="grid grid-cols-2 gap-x-10 gap-y-4 text-sm">
        <div>
          <div class="text-gray-500">PR Number</div>

          <div class="font-semibold text-black dark:text-white">
            {{ asset.document?.pr_number ?? '-' }}
          </div>
        </div>

        <div>
          <div class="text-gray-500">PO Number</div>

          <div class="font-semibold text-black dark:text-white">
            {{ asset.document?.po_number ?? '-' }}
          </div>
        </div>

        <div>
          <div class="text-gray-500">GR Number</div>

          <div class="font-semibold text-black dark:text-white">
            {{ asset.document?.gr_number ?? '-' }}
          </div>
        </div>

        <div>
          <div class="text-gray-500">Vendor</div>

          <div class="font-semibold text-black dark:text-white">
            {{ asset.vendor?.name ?? '-' }}
          </div>
        </div>

        <div>
          <div class="text-gray-500">Department</div>

          <div class="font-semibold text-black dark:text-white">
            {{ asset.department?.name ?? '-' }}
          </div>
        </div>

        <div>
          <div class="text-gray-500">Purchase Cost</div>

          <div class="font-semibold text-primary">
            {{ formatCurrency(asset.procurement?.purchase_cost) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Divider -->

    <div class="my-5 border-t border-stroke dark:border-strokedark"></div>

    <!-- Procurement Information -->

    <div class="grid grid-cols-1 gap-5 md:grid-cols-4">
      <div>
        <div class="text-xs text-gray-500 uppercase">Qty</div>

        <div class="font-semibold">
          {{ asset.procurement?.qty }}
        </div>
      </div>

      <div>
        <div class="text-xs text-gray-500 uppercase">UOM</div>

        <div class="font-semibold">
          {{ asset.procurement?.uom }}
        </div>
      </div>

      <div>
        <div class="text-xs text-gray-500 uppercase">Purchase Date</div>

        <div class="font-semibold">
          {{ formatDate(asset.procurement?.purchase_date) }}
        </div>
      </div>

      <div>
        <div class="text-xs text-gray-500 uppercase">Expected Arrival</div>

        <div class="font-semibold">
          {{ asset.procurement?.expected_arrival }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  asset: {
    type: Object,

    required: true,
  },
})

const formatCurrency = (value) => {
  if (!value) return '-'

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
</script>

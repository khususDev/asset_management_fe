<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" class="relative z-99999" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-6">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-boxdark"
            >
              <!-- Header -->
              <div
                class="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark"
              >
                <div>
                  <DialogTitle class="text-xl font-bold text-black dark:text-white">
                    Asset Detail
                  </DialogTitle>

                  <p class="mt-1 text-sm text-bodydark2">
                    {{ asset?.asset?.code }}
                  </p>
                </div>

                <button
                  @click="$emit('close')"
                  class="rounded p-2 hover:bg-gray-100 dark:hover:bg-meta-4"
                >
                  ✕
                </button>
              </div>

              <!-- Body -->
              <div v-if="asset" class="grid grid-cols-1 gap-6 p-6 xl:grid-cols-3">
                <!-- LEFT -->
                <div class="xl:col-span-2 space-y-6">
                  <!-- Asset Information -->
                  <div class="rounded-lg border border-stroke p-5">
                    <h3 class="mb-4 text-lg font-semibold">Asset Information</h3>

                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <InfoItem label="Asset Code" :value="asset.asset?.code" />

                      <InfoItem label="Asset Name" :value="asset.asset?.name" />

                      <InfoItem label="Category" :value="asset.category?.name" />

                      <InfoItem label="Type" :value="asset.type?.name" />

                      <InfoItem label="Brand" :value="asset.brand?.name" />

                      <InfoItem label="Model" :value="asset.model?.name" />

                      <InfoItem label="Serial Number" :value="asset.asset?.serial_number || '-'" />

                      <InfoItem label="Asset Class" :value="asset.asset?.class" />
                    </div>
                  </div>

                  <!-- Procurement -->
                  <div class="rounded-lg border border-stroke p-5">
                    <h3 class="mb-4 text-lg font-semibold">Procurement Information</h3>

                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <InfoItem label="Vendor" :value="asset.vendor?.name" />

                      <InfoItem label="Branch" :value="asset.branch?.name" />

                      <InfoItem
                        label="Purchase Date"
                        :value="formatDate(asset.procurement?.purchase_date)"
                      />

                      <InfoItem
                        label="Purchase Cost"
                        :value="formatCurrency(asset.procurement?.purchase_cost)"
                      />
                    </div>
                  </div>

                  <!-- Warranty -->
                  <div class="rounded-lg border border-stroke p-5">
                    <h3 class="mb-4 text-lg font-semibold">Warranty</h3>

                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <InfoItem label="Warranty Start" :value="formatDate(asset.warranty?.start)" />

                      <InfoItem label="Warranty End" :value="formatDate(asset.warranty?.end)" />
                    </div>
                  </div>
                </div>

                <!-- RIGHT -->
                <div class="space-y-6">
                  <div class="rounded-lg border border-stroke p-5">
                    <h3 class="mb-4 text-lg font-semibold">Current Status</h3>

                    <div class="space-y-4">
                      <div>
                        <div class="mb-1 text-xs text-gray-500">Asset Status</div>

                        <StatusBadge :status="asset?.status" />
                      </div>

                      <div>
                        <div class="mb-1 text-xs text-gray-500">Usage Status</div>

                        <UsageStatusBadge :usage="asset.usage" />
                      </div>

                      <InfoItem label="Assigned To" :value="asset.assigned_to?.name || '-'" />
                    </div>
                  </div>

                  <div class="rounded-lg border border-stroke p-5 text-center">
                    <h3 class="mb-4 text-lg font-semibold">QR Code</h3>

                    <div class="flex flex-col items-center">
                      <div class="rounded-lg border p-3 bg-white">
                        <img ref="qrImageElement" :src="qrImage" class="h-52 w-52" />
                      </div>

                      <div class="mt-4 text-sm font-semibold">
                        {{ asset?.asset?.code }}
                      </div>

                      <div class="mt-5 flex gap-3">
                        <button
                          @click="printQR"
                          class="rounded-lg bg-primary px-5 py-2 text-white hover:bg-opacity-90"
                        >
                          Print
                        </button>

                        <button
                          @click="downloadQR"
                          class="rounded-lg border border-primary px-5 py-2 text-primary hover:bg-primary hover:text-white"
                        >
                          Download PNG
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end border-t border-stroke px-6 py-4">
                <button @click="$emit('close')" class="rounded bg-primary px-6 py-2 text-white">
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import InfoItem from '@/components/Display/InfoItem.vue'
import StatusBadge from '@/components/Badge/StatusBadge.vue'
import UsageStatusBadge from '@/components/Badge/UsageStatusBadge.vue'
import QRCode from 'qrcode'
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  asset: Object,
})

defineEmits(['close'])

const qrImage = ref('')

const qrImageElement = ref(null)

const downloadQR = () => {
  if (!qrImage.value) return

  const link = document.createElement('a')

  link.href = qrImage.value

  link.download = `${props.asset.asset.code}.png`

  link.click()
}

const printQR = () => {
  if (!qrImage.value) return

  const win = window.open('', '_blank')

  win.document.write(`
        <html>

            <head>

                <title>${props.asset.asset.code}</title>

                <style>

                    body{

                        display:flex;
                        justify-content:center;
                        align-items:center;
                        height:100vh;
                        flex-direction:column;
                        font-family:Arial;

                    }

                    img{

                        width:250px;

                    }

                    h3{

                        margin-top:20px;

                    }

                </style>

            </head>

            <body>

                <img src="${qrImage.value}" />

                <h3>${props.asset.asset.code}</h3>

            </body>

        </html>
    `)

  win.document.close()

  win.focus()

  win.print()
}

const formatCurrency = (value) => {
  if (!value) return '-'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const formatDate = (date) => {
  if (!date) return '-'

  return new Date(date).toLocaleDateString('id-ID')
}

watch(
  () => props.asset,
  async (asset) => {
    // 1. Reset QR Image terlebih dahulu agar tidak menyimpan cache QR dari aset sebelumnya
    qrImage.value = ''

    // 2. Ambil data string QR (Fallback ke asset.code jika qr_code null/kosong)
    const qrText = asset?.asset?.qr_code || asset?.asset?.code

    if (!qrText) return

    try {
      qrImage.value = await QRCode.toDataURL(qrText, {
        width: 220,
        margin: 1,
      })
    } catch (err) {
      console.error('Gagal generate QR Code:', err)
    }
  },
  { immediate: true, deep: true },
)
</script>

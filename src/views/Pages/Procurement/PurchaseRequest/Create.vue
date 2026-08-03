<template>
  <div class="mx-auto max-w-screen-2xl relative">
    <!-- Toast Notifikasi Kustom -->
    <div
      v-if="toast.show"
      class="fixed top-5 right-5 z-99999 flex w-full max-w-sm rounded-lg border bg-white p-4 shadow-xl dark:bg-boxdark"
      :class="
        toast.type === 'success' ? 'border-success bg-success/5' : 'border-danger bg-danger/5'
      "
    >
      <div
        class="mr-3 flex h-5 w-5 items-center justify-center rounded-full text-white"
        :class="toast.type === 'success' ? 'bg-success' : 'bg-danger'"
      >
        <span class="text-xs font-bold">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
      </div>
      <div>
        <h5 class="font-semibold text-black dark:text-white text-sm">
          {{ toast.type === 'success' ? 'Sukses' : 'Gagal' }}
        </h5>
        <p class="text-xs text-gray-500 mt-0.5">{{ toast.message }}</p>
      </div>
    </div>

    <PageTitle title="Create Purchase Request" />

    <div
      v-if="isDataFetching"
      class="fixed top-0 left-0 w-full h-1 z-[99999] bg-primary/10 overflow-hidden"
    >
      <div class="h-full bg-primary indeterminate-bar"></div>
    </div>

    <div
      v-if="isDataFetching"
      class="rounded-sm border border-stroke bg-white p-6.5 shadow-default dark:border-strokedark dark:bg-boxdark mb-6 animate-pulse"
    >
      <div
        class="p-5 bg-gray-100 dark:bg-meta-4 rounded-lg border border-stroke dark:border-strokedark mb-6"
      >
        <div class="h-5 bg-gray-200 dark:bg-form-input rounded w-1/4 mb-5"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div class="h-10 bg-gray-200 dark:bg-form-input rounded w-full"></div>
          <div class="h-10 bg-gray-200 dark:bg-form-input rounded w-full"></div>
        </div>
        <div class="h-16 bg-gray-200 dark:bg-form-input rounded w-full mt-4"></div>
      </div>

      <div class="flex justify-between items-center mb-4">
        <div class="h-6 bg-gray-200 dark:bg-meta-4 rounded w-1/5"></div>
        <div class="h-9 bg-gray-200 dark:bg-meta-4 rounded w-32"></div>
      </div>
      <div class="space-y-6">
        <div
          class="p-5 border border-stroke dark:border-strokedark rounded-lg bg-gray-50/40 dark:bg-meta-4/20"
        >
          <div class="h-5 bg-gray-200 dark:bg-form-input rounded w-16 mb-4"></div>
          <div class="h-10 bg-gray-200 dark:bg-form-input rounded w-full mb-4"></div>
          <div class="h-10 bg-gray-200 dark:bg-form-input rounded w-full"></div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-6"
    >
      <div class="p-6.5 flex flex-col gap-6">
        <div
          class="p-5 bg-gray-50 dark:bg-meta-4 rounded-lg border border-stroke dark:border-strokedark"
        >
          <h3 class="font-bold text-black dark:text-white mb-4 text-lg border-b border-stroke pb-2">
            Informasi Utama Dokumen
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label class="mb-2.5 block text-black dark:text-white font-medium">PR Number</label>
              <input
                type="text"
                disabled
                placeholder="[ Otomatis Tergenerasi Sistem ]"
                class="w-full rounded border-[1.5px] border-stroke bg-gray-100 py-2 px-4 outline-none dark:border-form-strokedark dark:bg-meta-4 text-gray-500 font-bold text-center cursor-not-allowed italic"
              />
            </div>
            <div>
              <label class="mb-2.5 block text-black dark:text-white font-medium">Department</label>
              <select
                v-model="form.department_id"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4"
              >
                <option value="" disabled>Pilih Department</option>

                <option v-for="dept in masters.departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6 mb-4">
            <div class="mb-4">
              <label class="form-label">Approval Method</label>

              <div
                class="w-fit flex gap-6 mt-2.5 rounded border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
              >
                <label class="flex items-center gap-2">
                  <input type="radio" value="SYSTEM" v-model="form.approval_method" />
                  <span>System Approval</span>
                </label>

                <label class="flex items-center gap-2">
                  <input type="radio" value="MANUAL" v-model="form.approval_method" />
                  <span>Manual Approval</span>
                </label>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label class="mb-2.5 block text-black dark:text-white font-medium"
                >General Purpose</label
              >
              <FormInput
                v-model="form.purpose"
                rows="4"
                format="uppercase"
                is-textarea
                :error="errors?.purpose ? errors.purpose[0] : null"
                placeholder="Tujuan umum PR ini..."
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
              ></FormInput>
            </div>
          </div>
        </div>

        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-black dark:text-white text-lg">Daftar Kebutuhan Barang</h3>
            <button
              @click="addItem"
              type="button"
              class="bg-primary text-white px-4 py-2 text-sm rounded hover:bg-opacity-90 font-medium flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Tambah Barang
            </button>
          </div>

          <div class="space-y-6">
            <div
              v-for="(item, index) in form.items"
              :key="index"
              class="p-5 border-[1.5px] border-stroke dark:border-strokedark rounded-lg bg-white dark:bg-boxdark hover:border-primary/50 transition-colors"
            >
              <div
                class="flex justify-between items-center mb-4 border-b border-stroke dark:border-strokedark pb-2"
              >
                <h4 class="font-bold text-primary">Barang #{{ index + 1 }}</h4>
                <button
                  @click="removeItem(index)"
                  type="button"
                  class="text-danger hover:text-opacity-70 text-sm font-medium flex items-center gap-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                  Hapus
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                <div class="md:col-span-5">
                  <label class="mb-1 block text-sm font-medium text-black dark:text-white"
                    >Deskripsi / Nama Barang *</label
                  >
                  <FormInput
                    type="text"
                    format="uppercase"
                    :error="
                      errors?.items && errors.items[index] && errors.items[index].item_description
                        ? errors.items[index].item_description[0]
                        : null
                    "
                    placeholder="Nama / Deskripsi Barang"
                    v-model="item.item_description"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="mb-1 block text-sm font-medium text-black dark:text-white"
                    >Qty *</label
                  >
                  <input
                    type="number"
                    v-model="item.quantity"
                    min="1"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-sm text-center focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="mb-1 block text-sm font-medium text-black dark:text-white"
                    >UoM</label
                  >
                  <select
                    v-model="item.uom_id"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-sm focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                  >
                    <option value="" disabled>Pilih Unit</option>
                    <option v-for="uom in masters.uoms" :key="uom.id" :value="uom.id">
                      {{ uom.name }}
                    </option>
                  </select>
                </div>
                <div class="md:col-span-3">
                  <label class="mb-1 block text-sm font-medium text-black dark:text-white"
                    >Harga Satuan *</label
                  >
                  <input
                    type="number"
                    v-model="item.unit_price"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-sm text-right focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
              </div>

              <div
                class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-gray-50 dark:bg-meta-4 p-3 rounded"
              >
                <!-- Vendor -->
                <div>
                  <label class="mb-1 block text-sm font-medium text-black dark:text-white">
                    Vendor
                  </label>

                  <select
                    v-model="item.vendor_id"
                    class="w-full rounded border-[1.5px] border-stroke bg-white py-2 px-3 text-sm dark:bg-form-input"
                  >
                    <option value="" disabled>Pilih Vendor</option>

                    <option v-for="vendor in masters.vendors" :key="vendor.id" :value="vendor.id">
                      {{ vendor.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="mb-1 block text-sm font-medium text-black dark:text-white">
                    Vendor Name
                  </label>

                  <FormInput
                    type="text"
                    format="uppercase"
                    :error="
                      errors?.items && errors.items[index] && errors.items[index].vendor_name
                        ? errors.items[index].vendor_name[0]
                        : null
                    "
                    v-model="item.vendor_name"
                    placeholder="Nama Vendor / Nama Toko"
                    class="w-full rounded border-[1.5px] border-stroke bg-white py-2 px-3 text-sm dark:bg-form-input"
                  />
                </div>

                <!-- Asset Class -->
                <div>
                  <label class="mb-1 block text-sm font-medium text-black dark:text-white">
                    Asset Class
                  </label>

                  <select
                    v-model="item.asset_class"
                    class="w-full rounded border-[1.5px] border-stroke bg-white py-2 px-3 text-sm dark:bg-form-input"
                  >
                    <option value="FIXED_ASSET">Fixed Asset</option>
                    <option value="CONSUMABLE">Consumable</option>
                    <option value="LICENSE">License</option>
                  </select>
                </div>
              </div>

              <div
                class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-gray-50 dark:bg-meta-4 p-3 rounded"
              >
                <!-- URL -->
                <div>
                  <label class="mb-1 block text-sm font-medium text-black dark:text-white">
                    URL Referensi
                  </label>

                  <input
                    type="text"
                    v-model="item.url"
                    class="w-full rounded border-[1.5px] border-stroke bg-white py-2 px-3 text-sm dark:bg-form-input"
                  />
                </div>

                <!-- PIC -->
                <div>
                  <label class="mb-1 block text-sm font-medium text-black dark:text-white">
                    PIC Contact
                  </label>

                  <input
                    type="text"
                    v-model="item.pic_contact"
                    class="w-full rounded border-[1.5px] border-stroke bg-white py-2 px-3 text-sm dark:bg-form-input"
                  />
                </div>

                <!-- Checkbox -->
                <div class="flex flex-col justify-center gap-2 pt-4">
                  <label class="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" v-model="item.need_to_issue_po" />
                    Perlu PO?
                  </label>

                  <div class="flex gap-4">
                    <label class="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" v-model="item.is_pkp" />
                      PKP?
                    </label>

                    <label class="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" v-model="item.price_include_ppn" />
                      Inc PPN?
                    </label>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="mb-1 block text-sm font-medium text-black dark:text-white"
                    >TOP</label
                  >
                  <select
                    v-model="item.payment_term_id"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-sm dark:bg-form-input"
                  >
                    <option value="" disabled>Pilih Pembayaran</option>
                    <option v-for="pay in masters.payments" :key="pay.id" :value="pay.id">
                      {{ pay.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="mb-1 block text-sm font-medium text-black dark:text-white"
                    >Delivery Address</label
                  >
                  <select
                    v-model="item.delivery_branch_id"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-sm dark:bg-form-input"
                  >
                    <option value="" disabled>Pilih Lokasi</option>
                    <option v-for="branch in masters.branchs" :key="branch.id" :value="branch.id">
                      {{ branch.code }} - {{ branch.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="mb-1 block text-sm font-medium text-black dark:text-white">
                    Est Kedatangan
                  </label>
                  <DateInput v-model="item.expected_arrival_date" />
                </div>
              </div>

              <div
                class="mt-4 border-t border-stroke dark:border-strokedark pt-3 flex justify-between items-end"
              >
                <div class="w-2/3">
                  <FormInput
                    type="text"
                    format="uppercase"
                    :error="
                      errors?.items && errors.items[index] && errors.items[index].item_purpose
                        ? errors.items[index].item_purpose[0]
                        : null
                    "
                    label="Tujuan Spesifik Barang"
                    v-model="item.item_purpose"
                    is-textarea
                    placeholder="Tujuan spesifik barang ini..."
                    rows="2"
                    class="w-full border-b bg-transparent py-1 text-sm outline-none focus:border-primary dark:border-form-strokedark"
                  />
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-500 block">Subtotal Item</span>
                  <span class="text-lg font-bold text-meta-3">{{
                    formatCurrency(item.quantity * item.unit_price)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-stroke pt-6"
        >
          <div class="flex gap-4">
            <button
              @click="$router.push({ name: 'opt_purchase_request' })"
              class="px-6 py-2 rounded border border-stroke text-black dark:border-strokedark dark:text-white hover:bg-gray-100 transition-all"
            >
              Batal
            </button>
            <button
              @click="submitForm"
              :disabled="loading || form.items.length === 0"
              class="px-6 py-2 rounded bg-primary text-white font-medium hover:bg-opacity-90 disabled:bg-opacity-50 transition-all shadow-md"
            >
              {{ loading ? 'Menyimpan...' : 'Ajukan Purchase Request Baru' }}
            </button>
          </div>
          <div
            class="bg-gray-50 dark:bg-meta-4 py-4 px-6 rounded-lg border border-stroke dark:border-strokedark flex items-center gap-6 min-w-[300px] shadow-sm"
          >
            <span class="font-bold text-sm text-black dark:text-white uppercase tracking-wider"
              >Grand Total:</span
            >
            <span class="text-2xl font-bold text-primary ml-auto">{{
              formatCurrency(grandTotal)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { API_ENDPOINTS } from '@/api/endpoints'

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import PageTitle from '@/Components/common/PageTitle.vue'
import DateInput from '@/components/Form/DateInput.vue'
import FormInput from '@/components/Form/FormInput.vue'

const router = useRouter()
const loading = ref(false)

const isDataFetching = ref(true)

const masters = ref({ uoms: [], vendors: [], payments: [], branchs: [], departments: [] })

const form = ref({ department_id: '', approval_method: 'SYSTEM', purpose: '', items: [] })

const toast = ref({ show: false, type: 'success', message: '' })
const showToast = (type, message) => {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

const formatCurrency = (value) => {
  if (!value || value == 0) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const grandTotal = computed(() => {
  if (!form.value.items) return 0
  return form.value.items.reduce((total, item) => total + item.quantity * item.unit_price, 0)
})

// 🔥 BARU: Ambil seluruh data master dropdown menggunakan 1 endpoint tunggal terpusat
const fetchMasterDataOnly = async () => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  isDataFetching.value = true

  try {
    const response = await axios.get(API_ENDPOINTS.optPurchaseRequest_masters, {
      headers,
    })
    const masterData = response.data.data

    masters.value = {
      uoms: masterData.uoms,
      vendors: masterData.vendors,
      payments: masterData.payments,
      branchs: masterData.branchs,
      departments: masterData.departments,
    }

    // Otomatis berikan 1 baris item kosong di awal biar user tidak bingung kotak inputannya mana
    if (form.value.items.length === 0) {
      addItem()
    }
  } catch (error) {
    showToast('danger', 'Gagal memuat master data dropdown dari server.')
    console.error(error)
  } finally {
    isDataFetching.value = false
  }
}

const addItem = () => {
  form.value.items.push({
    // Informasi Barang
    item_description: '',
    quantity: 1,
    uom_id: '',
    unit_price: 0,

    // Vendor
    vendor_id: '',
    vendor_name: '',

    // Klasifikasi Asset
    asset_class: 'FIXED_ASSET',

    // Procurement
    need_to_issue_po: true,
    is_pkp: false,
    price_include_ppn: false,

    // Informasi Vendor
    pic_contact: '',
    url: '',

    // Payment & Delivery
    payment_term_id: '',
    expected_arrival_date: '',
    delivery_branch_id: '',

    // Purpose
    item_purpose: '',
  })
}

const removeItem = (index) => {
  form.value.items.splice(index, 1)
}

// 🔥 BARU: Eksekusi simpan kirim POST data baru ke database Laravel Anda
const submitForm = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.post(API_ENDPOINTS.optPurchaseRequest, form.value, {
      headers: { Authorization: `Bearer ${token}` },
    })
    showToast('success', response.data.message || 'Purchase Request baru berhasil diajukan!')
    setTimeout(() => {
      router.push({ name: 'opt_purchase_request' })
    }, 1500)
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      'Gagal menyimpan. Pastikan semua kolom wajib (*) sudah terisi.'
    showToast('danger', errorMsg)
    console.error(error.response?.data)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMasterDataOnly()
})
</script>

<style scoped>
.indeterminate-bar {
  width: 40%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-radius: 2px;
  animation: progress-bar-motion 1.2s infinite linear;
}

@keyframes progress-bar-motion {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(250%);
  }
}
</style>

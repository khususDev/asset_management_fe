<template>
  <div class="mx-auto max-w-screen-xl">
    <!-- Toast Notification -->
    <div
      v-if="toast.show"
      class="fixed top-5 right-5 z-99999 flex w-full max-w-sm rounded-lg border bg-white p-4 shadow-xl"
      :class="toast.type == 'success' ? 'border-success bg-success/5' : 'border-danger bg-danger/5'"
    >
      <div
        class="mr-3 flex h-5 w-5 items-center justify-center rounded-full text-white"
        :class="toast.type == 'success' ? 'bg-success' : 'bg-danger'"
      >
        {{ toast.type == 'success' ? '✓' : '✕' }}
      </div>
      <div>
        <div class="font-semibold">
          {{ toast.type == 'success' ? 'Success' : 'Failed' }}
        </div>
        <div class="text-sm">
          {{ toast.message }}
        </div>
      </div>
    </div>

    <PageTitle title="Register Aset Eksisting" />

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- 1. INFORMASI UTAMA -->
      <div
        class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <h3 class="mb-4 text-lg font-semibold text-black dark:text-white border-b pb-2">
          1. Informasi Utama
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Class Selector (Pemicu Perubahan Form) -->
          <div>
            <label class="block text-sm font-medium mb-1">
              Asset Class <span class="text-danger">*</span>
            </label>
            <select
              v-model="form.asset_class"
              required
              class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="FIXED_ASSET">Fixed Asset (Aset Tetap)</option>
              <option value="CONSUMABLE">Consumable (Barang Pakai Habis)</option>
              <option value="LICENSE">License (Lisensi Software)</option>
            </select>
          </div>

          <!-- Nama Aset / Software / Item -->
          <div>
            <FormInput
              :label="form.asset_class === 'LICENSE' ? 'Software / License Name *' : 'Item Name *'"
              v-model="form.asset_name"
              format="uppercase"
              :error="errors?.asset_name ? errors.asset_name[0] : null"
              :placeholder="
                form.asset_class === 'LICENSE' ? 'Ex: Adobe Creative Cloud' : 'Item Name'
              "
              required
            />
          </div>

          <!-- Kategori -->
          <div>
            <label class="block text-sm font-medium mb-1">
              Category <span class="text-danger">*</span>
            </label>
            <select
              v-model="form.asset_category_id"
              required
              class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">-- Select Category --</option>
              <option v-for="cat in masters.categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Vendor (Untuk License & Consumable) -->
          <div v-if="form.asset_class !== 'FIXED_ASSET'">
            <label class="block text-sm font-medium mb-1">Vendor / Supplier</label>
            <select
              v-model="form.vendor_id"
              class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">-- Select Vendor --</option>
              <option v-for="v in masters.vendors" :key="v.id" :value="v.id">
                {{ v.name }}
              </option>
            </select>
          </div>

          <!-- FIELD KHUSUS FIXED ASSET -->
          <template v-if="form.asset_class === 'FIXED_ASSET'">
            <div>
              <label class="block text-sm font-medium mb-1">Asset Type</label>
              <select
                v-model="form.asset_type_id"
                class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">-- Select Type --</option>
                <option v-for="t in masters.types" :key="t.id" :value="t.id">
                  {{ t.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Brand</label>
              <select
                v-model="form.brand_id"
                class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">-- Select Brand --</option>
                <option v-for="b in masters.brands" :key="b.id" :value="b.id">
                  {{ b.name }}
                </option>
              </select>
            </div>

            <div>
              <FormInput
                label="Serial Number (S/N)"
                v-model="form.serial_number"
                format="uppercase"
                placeholder="Ex: PF-2X9AZ1"
              />
            </div>
          </template>

          <!-- FIELD KHUSUS LICENSE -->
          <template v-if="form.asset_class === 'LICENSE'">
            <div>
              <FormInput
                label="License Key / Product Key"
                v-model="form.license_key"
                format="uppercase"
                placeholder="Ex: XXXX-XXXX-XXXX-XXXX"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">License Type</label>
              <select
                v-model="form.license_type"
                class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="SUBSCRIPTION">Subscription (Berlangganan)</option>
                <option value="PERPETUAL">Perpetual (Permanen)</option>
                <option value="OEM">OEM</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Total Seats / Users</label>
              <input
                v-model.number="form.total_seats"
                type="number"
                min="1"
                class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Ex: 5"
              />
            </div>
          </template>

          <!-- FIELD KHUSUS CONSUMABLE -->
          <template v-if="form.asset_class === 'CONSUMABLE'">
            <div>
              <label class="block text-sm font-medium mb-1">Unit of Measure (Satuan)</label>
              <input
                v-model="form.unit_of_measure"
                type="text"
                class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Ex: Pcs, Box, Rim, Pack"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Initial Stock (Jumlah Stock)</label>
              <input
                v-model.number="form.total_quantity"
                type="number"
                min="1"
                class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Ex: 100"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Min. Stock Alert</label>
              <input
                v-model.number="form.min_stock_alert"
                type="number"
                min="0"
                class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Ex: 10"
              />
            </div>
          </template>
        </div>
      </div>

      <!-- 2. PENEMPATAN & LOKASI (Tampil untuk Fixed Asset & Consumable) -->
      <div
        v-if="form.asset_class !== 'LICENSE'"
        class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <h3 class="mb-4 text-lg font-semibold text-black dark:text-white border-b pb-2">
          2. Placement & Location
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Branch</label>
            <select
              v-model="form.branch_id"
              class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">-- Select Branch --</option>
              <option v-for="b in masters.branches" :key="b.id" :value="b.id">
                {{ b.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Location Storage</label>
            <select
              v-model="form.location_id"
              class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">-- Select Location --</option>
              <option v-for="loc in masters.locations" :key="loc.id" :value="loc.id">
                {{ loc.name }}
              </option>
            </select>
          </div>

          <div v-if="form.asset_class === 'FIXED_ASSET'">
            <label class="block text-sm font-medium mb-1">Department Owner</label>
            <select
              v-model="form.department_id"
              class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">-- Pilih Departemen --</option>
              <option v-for="dept in masters.departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 3. DIRECT ASSIGNMENT (Hanya untuk Fixed Asset & License, Consumable TIDAK butuh assignment awal) -->
      <div
        v-if="form.asset_class !== 'CONSUMABLE'"
        class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="flex items-center justify-between border-b pb-2 mb-4">
          <h3 class="text-lg font-semibold text-black dark:text-white">
            3. Direct Assignment {{ form.asset_class === 'LICENSE' ? '(Seat Holder)' : '' }}
          </h3>
          <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium"
            >Optional</span
          >
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Assign to Employee</label>
            <select
              v-model="form.assigned_to"
              class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">-- Available / Unassigned --</option>
              <option v-for="emp in masters.employees" :key="emp.id" :value="emp.id">
                {{ emp.name }} {{ emp.email ? `(${emp.email})` : '' }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Assignment Date</label>
            <DateInput v-model="form.assigned_date" />
          </div>
        </div>
      </div>

      <!-- 4. RIWAYAT PEMBELIAN & SPESIFIKASI TAMBAHAN -->
      <div
        class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <h3 class="mb-4 text-lg font-semibold text-black dark:text-white border-b pb-2">
          4. Acquisition & Additional Details
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Acquisition / Purchase Date</label>
            <!-- Diperbaiki: v-model disesuaikan ke purchase_date -->
            <DateInput v-model="form.purchase_date" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">
              {{
                form.asset_class === 'CONSUMABLE' ? 'Unit Cost Price (Rp)' : 'Purchase Cost (Rp)'
              }}
            </label>
            <input
              v-model="form.purchase_cost"
              type="number"
              min="0"
              class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="0"
            />
          </div>

          <!-- Kondisi Fisik hanya untuk Fixed Asset -->
          <div v-if="form.asset_class === 'FIXED_ASSET'">
            <label class="block text-sm font-medium mb-1">Physical Condition</label>
            <select
              v-model="form.status_id"
              class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">-- Select Condition --</option>
              <option v-for="st in masters.statuses" :key="st.id" :value="st.id">
                {{ st.name }}
              </option>
            </select>
          </div>

          <!-- Expiration Date hanya untuk License -->
          <div v-if="form.asset_class === 'LICENSE'">
            <label class="block text-sm font-medium mb-1">Expiration Date</label>
            <DateInput v-model="form.expiration_date" />
          </div>

          <div class="md:col-span-3">
            <label class="block text-sm font-medium mb-1">Migration / Additional Notes</label>
            <textarea
              v-model="form.remarks"
              rows="2"
              class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Contoh: Barang migrasi dari sistem lama / Pembelian tahun 2021."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- TOMBOL ACTION -->
      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="$router.push({ name: 'opt_asset_registration' })"
          class="rounded border border-stroke px-6 py-2.5 text-sm font-medium hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="rounded bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
        >
          {{ isSubmitting ? 'Menyimpan...' : 'Simpan Registration' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { API_ENDPOINTS } from '@/api/endpoints'
import PageTitle from '@/Components/common/PageTitle.vue'
import DateInput from '@/components/Form/DateInput.vue'
import FormInput from '@/Components/Form/FormInput.vue'

const router = useRouter()
const isSubmitting = ref(false)
const errors = ref({})

const toast = ref({
  show: false,
  type: 'success',
  message: '',
})

const showToast = (type, message) => {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const masters = ref({
  categories: [],
  types: [],
  brands: [],
  statuses: [],
  branches: [],
  locations: [],
  departments: [],
  employees: [],
  vendors: [],
})

// Single form state untuk menangani 3 jenis Asset Class
const form = ref({
  asset_name: '',
  asset_class: 'FIXED_ASSET',
  asset_category_id: '',
  asset_type_id: '',
  brand_id: '',
  serial_number: '',
  vendor_id: '',
  branch_id: '',
  location_id: '',
  department_id: '',
  assigned_to: '',
  assigned_date: new Date().toISOString().substr(0, 10),
  purchase_date: new Date().toISOString().substr(0, 10),
  purchase_cost: '',
  status_id: '',
  remarks: '',

  // Field Spesifik Lisensi
  license_key: '',
  license_type: 'SUBSCRIPTION',
  total_seats: 1,
  expiration_date: '',

  // Field Spesifik Consumable
  unit_of_measure: 'Pcs',
  total_quantity: 1,
  min_stock_alert: 5,
})

const fetchMasters = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(API_ENDPOINTS.assetRegistrationMasters, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const resData = response.data.data

    masters.value = {
      categories: resData.categories ?? [],
      types: resData.types ?? [],
      brands: resData.brands ?? [],
      statuses: resData.statuses ?? [],
      branches: resData.branches ?? resData.branchs ?? [],
      locations: resData.locations ?? [],
      departments: resData.departments ?? resData.departmens ?? [],
      employees: resData.employees ?? resData.users ?? [],
      vendors: resData.vendors ?? [],
    }

    if (masters.value.statuses.length > 0) {
      form.value.status_id = masters.value.statuses[0].id
    }
  } catch (error) {
    console.error('Gagal memuat master data:', error)
  }
}

const submitForm = async () => {
  isSubmitting.value = true
  errors.value = {}

  try {
    const token = localStorage.getItem('token')

    const response = await axios.post(`${API_ENDPOINTS.assetRegistration}/existing`, form.value, {
      headers: { Authorization: `Bearer ${token}` },
    })

    showToast('success', response.data.message ?? 'Registration Success')

    setTimeout(() => {
      router.push({ name: 'opt_asset_registration' })
    }, 1200)
  } catch (error) {
    console.error(error)
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
    showToast('error', error.response?.data?.message ?? 'Registration failed.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchMasters)
</script>

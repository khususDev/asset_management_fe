<template>
  <div class="mx-auto max-w-screen-xl">
    <!-- Toast -->
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

    <Breadcrumb pageTitle="Register Aset Eksisting" :crumbs="['Operations', 'Asset Management']" />

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- 1. INFORMASI UTAMA ASET -->
      <div
        class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <h3 class="mb-4 text-lg font-semibold text-black dark:text-white border-b pb-2">
          1. Informasi Utama Aset
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FormInput
              label="Asset Name"
              v-model="form.asset_name"
              format="uppercase"
              :error="errors?.code ? errors.code[0] : null"
              placeholder="Ex: Laptop Thinkpad"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1"
              >Asset Class <span class="text-danger">*</span></label
            >
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

          <div>
            <label class="block text-sm font-medium mb-1"
              >Category <span class="text-danger">*</span></label
            >
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
              :error="errors?.serial_number ? errors.serial_number[0] : null"
              placeholder="Ex: PF-2X9AZ1"
            />
          </div>
        </div>
      </div>

      <!-- 2. LOKASI & PENEMPATAN -->
      <div
        class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <h3 class="mb-4 text-lg font-semibold text-black dark:text-white border-b pb-2">
          2. Placement & Location
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1"
              >Branch <span class="text-danger">*</span></label
            >
            <select
              v-model="form.branch_id"
              required
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

          <div>
            <label class="block text-sm font-medium mb-1">Department</label>
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

      <!-- 3. PENUGASAN / ASSIGNMENT (OPSIONAL) -->
      <div
        class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="flex items-center justify-between border-b pb-2 mb-4">
          <h3 class="text-lg font-semibold text-black dark:text-white">3. Direct Assignment</h3>
          <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium"
            >Optional</span
          >
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Assign to</label>
            <select
              v-model="form.assigned_to"
              class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">-- Available --</option>
              <option v-for="emp in masters.employees" :key="emp.id" :value="emp.id">
                {{ emp.name }} {{ emp.email ? `(${emp.email})` : '' }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium"> Assignment Date </label>
            <DateInput v-model="form.assigned_date" />
          </div>
        </div>
      </div>

      <div
        class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <h3 class="mb-4 text-lg font-semibold text-black dark:text-white border-b pb-2">
          4. Acquisition History & Condition
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium"> Acquisition Date (Year Purchased) </label>
            <DateInput v-model="form.assigned_date" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Estimated Purchase Price (Rp)</label>
            <input
              v-model="form.purchase_cost"
              type="number"
              min="0"
              class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="0"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1"
              >Physical Condition <span class="text-danger">*</span></label
            >
            <select
              v-model="form.status_id"
              required
              class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">-- Select Condition --</option>
              <option v-for="st in masters.statuses" :key="st.id" :value="st.id">
                {{ st.name }}
              </option>
            </select>
          </div>

          <div class="md:col-span-3">
            <label class="block text-sm font-medium mb-1">Migration Notes</label>
            <textarea
              v-model="form.remarks"
              rows="2"
              class="w-full rounded border border-stroke px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Contoh: Laptop pembelian tahun 2012, kondisi fisik masih baik."
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
          :disabled="loading"
          class="rounded bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
        >
          {{ loading ? 'Menyimpan...' : 'Simpan Aset Eksisting' }}
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
import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import DateInput from '@/components/Form/DateInput.vue'

import FormInput from '@/Components/Form/FormInput.vue'

const router = useRouter()
const loading = ref(false)

const isSubmitting = ref(false)

const toast = ref({
  show: false,
  type: 'success',
  message: '',
})

const showToast = (type, message) => {
  toast.value = {
    show: true,
    type,
    message,
  }

  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const masters = ref({
  categories: [],
  types: [],
  brands: [],
  models: [],
  statuses: [],
  branches: [],
  locations: [],
  departments: [],
  employees: [],
})

const form = ref({
  asset_name: '',
  asset_class: 'FIXED_ASSET',
  asset_category_id: '',
  asset_type_id: '',
  brand_id: '',
  serial_number: '',
  branch_id: '',
  location_id: '',
  department_id: '',
  assigned_to: '',
  assigned_date: new Date().toISOString().substr(0, 10),
  purchase_date: '',
  purchase_cost: '',
  status_id: '',
  remarks: '',
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
      models: resData.models ?? [],
      statuses: resData.statuses ?? [],
      branches: resData.branches ?? resData.branchs ?? [],
      locations: resData.locations ?? [],
      departments: resData.departments ?? resData.departmens ?? [], // Menangani 'departments' / 'departmens'
      employees: resData.employees ?? resData.users ?? [],
    }

    if (resData.asset_code) {
      form.value.asset_code = resData.asset_code
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
  try {
    const token = localStorage.getItem('token')

    // Perubahan ada di baris ini: tangkap hasil response axios ke variabel 'response'
    const response = await axios.post(`${API_ENDPOINTS.assetRegistration}/existing`, form.value, {
      headers: { Authorization: `Bearer ${token}` },
    })

    showToast('success', response.data.message ?? 'Registration Success')

    setTimeout(() => {
      router.push({
        name: 'opt_asset_registration',
      })
    }, 1200)
  } catch (error) {
    console.error(error)
    showToast('error', error.response?.data?.message ?? 'Registration failed.')
  } finally {
    isSubmitting.value = false
  }
}
onMounted(fetchMasters)
</script>

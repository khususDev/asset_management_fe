<template>
  <div class="mx-auto max-w-screen-2xl relative">
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

    <!-- Breadcrumb -->
    <Breadcrumb
      pageTitle="Asset Registration"
      :crumbs="['Operations', 'Asset Management', 'Registration']"
    />

    <!-- Loading -->
    <div v-if="isLoading" class="rounded-lg border bg-white p-10 text-center">Loading...</div>

    <!-- Content -->
    <template v-else>
      <!-- Header -->
      <div class="mb-6 rounded-lg border border-primary/20 bg-white shadow-default">
        <div class="border-b px-6 py-4">
          <div class="text-xs uppercase text-primary font-bold">Asset Registration</div>

          <div class="mt-1 text-xl font-bold">
            {{ asset.asset.name }}
          </div>
        </div>

        <div class="grid grid-cols-4 gap-6 p-6 text-sm">
          <div>
            <div class="text-gray-500">Asset Class</div>

            <div class="font-semibold">
              {{ asset.asset.class }}
            </div>
          </div>

          <div>
            <div class="text-gray-500">Department</div>

            <div class="font-semibold">
              {{ asset.department.name }}
            </div>
          </div>

          <div>
            <div class="text-gray-500">Vendor</div>

            <div class="font-semibold">
              {{ asset.vendor.name }}
            </div>
          </div>

          <div>
            <div class="text-gray-500">Purchase Cost</div>

            <div class="font-semibold">
              {{ formatCurrency(asset.procurement.purchase_cost) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->

      <form @submit.prevent="submitRegistration">
        <!-- FIXED ASSET -->

        <!-- <div class="mb-3 p-3 bg-yellow-100 rounded">
          {{ asset.asset.class }}
        </div> -->

        <FixedAssetForm
          v-if="asset.asset.class == 'FIXED_ASSET'"
          v-model="form"
          :masters="masterOptions"
        />

        <!-- CONSUMABLE -->

        <ConsumableForm
          v-if="asset.asset.class === 'CONSUMABLE'"
          v-model="form"
          :masters="masterOptions"
        />

        <!-- LICENSE -->

        <LicenseForm
          v-if="asset.asset.class == 'LICENSE'"
          v-model="form"
          :masters="masterOptions"
        />

        <!-- Footer -->

        <div class="mt-6 rounded-lg border bg-white p-5 flex justify-end gap-3">
          <button type="button" @click="$router.back()" class="rounded border px-5 py-2">
            Cancel
          </button>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="rounded bg-primary px-5 py-2 text-white"
          >
            {{ isSubmitting ? 'Saving...' : 'Register Asset' }}
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Breadcrumb from '@/Components/Page/Breadcrumb.vue'

import FixedAssetForm from './components/FixedAssetForm.vue'
import ConsumableForm from './components/ConsumableForm.vue'
import LicenseForm from './components/LicenseForm.vue'

const route = useRoute()
const router = useRouter()

const assetId = route.params.id

const isLoading = ref(true)
const isSubmitting = ref(false)

const asset = ref({
  asset: {},
  department: {},
  vendor: {},
  procurement: {},
  registration: {},
})

const masterOptions = ref({
  categories: [],
  types: [],
  brands: [],
  models: [],
  statuses: [],
  branchs: [],
  locations: [],
})

const form = ref({
  serial_number: '',

  asset_category_id: '',
  asset_type_id: '',

  brand_id: '',
  model_id: '',

  status_id: '',
  location_id: '',

  warranty_start: '',
  warranty_end: '',

  useful_life: '',

  remarks: '',
})

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

const fetchAsset = async () => {
  try {
    const token = localStorage.getItem('token')

    const response = await axios.get(`/opt_asset_registration/${assetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    asset.value = response.data.data

    form.value = {
      serial_number: asset.value.asset.serial_number ?? '',

      asset_category_id: asset.value.registration.category_id ?? '',

      asset_type_id: asset.value.registration.type_id ?? '',

      brand_id: asset.value.registration.brand_id ?? '',

      model_id: asset.value.registration.model_id ?? '',

      status_id: asset.value.registration.status_id ?? '',

      branch_id: asset.value.registration.branch_id ?? '',

      location_id: asset.value.registration.location_id ?? '',

      warranty_start: asset.value.registration.warranty_start ?? '',

      warranty_end: asset.value.registration.warranty_end ?? '',

      useful_life: asset.value.registration.useful_life ?? '',

      remarks: asset.value.registration.remarks ?? '',
    }
  } catch (e) {
    console.error(e)

    showToast('error', 'Gagal memuat data asset')
  } finally {
    isLoading.value = false
  }
}

const fetchMasters = async () => {
  try {
    const token = localStorage.getItem('token')

    const response = await axios.get('/opt_asset_registration/masters', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    masterOptions.value = {
      categories: response.data.data.categories ?? [],
      types: response.data.data.types ?? [],
      brands: response.data.data.brands ?? [],
      models: response.data.data.models ?? [],
      statuses: response.data.data.statuses ?? [],
      branchs: response.data.data.branchs ?? [],
      locations: response.data.data.locations ?? [],
    }
  } catch (error) {
    console.error(error)
  }
}

const submitRegistration = async () => {
  isSubmitting.value = true

  try {
    const token = localStorage.getItem('token')

    const response = await axios.put(`/opt_asset_registration/${assetId}/register`, form.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    showToast('success', response.data.message ?? 'Registration Success')

    setTimeout(() => {
      router.push({
        name: 'opt_asset_registration.index',
      })
    }, 1200)
  } catch (error) {
    console.error(error)

    showToast('error', error.response?.data?.message ?? 'Registration failed.')
  } finally {
    isSubmitting.value = false
  }
}

const formatCurrency = (value) => {
  if (!value) return 'Rp 0'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

onMounted(async () => {
  await Promise.all([fetchAsset(), fetchMasters()])
})
</script>

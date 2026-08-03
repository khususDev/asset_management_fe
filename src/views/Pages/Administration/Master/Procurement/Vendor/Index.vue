<template>
  <div class="mx-auto max-w-screen-2xl">
    <PageTitle title="Master Vendors" />

    <DataTable
      :headers="['Code', 'Vendor Name', 'Contact Person', 'Email', 'Phone', 'Status', 'Action']"
      :from="vendorsData.from"
      :to="vendorsData.to"
      :total="vendorsData.total"
      :search="search"
      :entries="entries"
      @search="search = $event"
      @update:entries="entries = $event"
    >
      <template #top-actions>
        <button
          @click="openCreate"
          class="rounded bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
        >
          Tambah Vendor
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="7" />

      <tr
        v-else
        v-for="vendor in vendorsData.data"
        :key="vendor.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center font-medium text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ vendor.code }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ vendor.name }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ vendor.contact_person || '-' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ vendor.email || '-' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ vendor.phone || '-' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <StatusBadge :active="vendor.is_active" />
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <TableAction show-edit-delete @edit="openEdit(vendor)" @delete="openDelete(vendor.id)" />
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!vendorsData.data || vendorsData.data.length === 0)"
        :colspan="7"
      />

      <template #pagination>
        <Pagination :links="vendorsData.links" @change-page="fetchVendors" />
      </template>
    </DataTable>

    <Modal :show="showModal" :title="isEdit ? 'Edit Vendor' : 'Tambah Vendor'" @close="closeModal">
      <div class="p-6 flex flex-col gap-4">
        <FormInput
          label="Vendor Code"
          v-model="form.code"
          format="uppercase"
          :disabled="isEdit"
          :error="errors?.code ? errors.code[0] : null"
          placeholder="e.g., VND-001, PT-MJU"
        />

        <FormInput
          label="Vendor Name"
          v-model="form.name"
          format="uppercase"
          :error="errors?.name ? errors.name[0] : null"
          placeholder="e.g., PT Maju Mundur IT"
        />

        <div class="flex flex-col sm:flex-row gap-4">
          <div class="w-full sm:w-1/2">
            <FormInput
              label="Contact Person"
              v-model="form.contact_person"
              format="title"
              :error="errors?.contact_person ? errors.contact_person[0] : null"
              placeholder="e.g., Budi Santoso"
            />
          </div>
          <div class="w-full sm:w-1/2">
            <FormInput
              label="Phone Number"
              v-model="form.phone"
              format="number"
              :error="errors?.phone ? errors.phone[0] : null"
              placeholder="e.g., 08123456789"
            />
          </div>
        </div>

        <FormInput
          label="Email Address"
          type="email"
          v-model="form.email"
          :error="errors?.email ? errors.email[0] : null"
          placeholder="e.g., sales@vendor.com"
        />

        <div>
          <label class="mb-2.5 block text-sm font-medium text-black dark:text-white">Address</label>
          <textarea
            v-model="form.address"
            rows="3"
            format="capitalize"
            placeholder="Alamat lengkap vendor..."
            class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            :class="{ 'border-danger focus:border-danger': errors?.address }"
          ></textarea>
          <p v-if="errors?.address" class="mt-1 text-xs text-danger">{{ errors.address[0] }}</p>
        </div>

        <FormCheckbox label="Active Status" v-model="form.is_active" />
      </div>

      <template #footer>
        <button
          @click="closeModal"
          class="px-4 py-2 text-black dark:text-white hover:text-opacity-80"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          :disabled="loading"
          class="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50 transition-all"
        >
          {{ loading ? 'Saving...' : 'Simpan' }}
        </button>
      </template>
    </Modal>

    <ConfirmModal :show="showDeleteModal" @close="closeDeleteModal" @confirm="handleDelete" />
  </div>
</template>

<script setup>
import { API_ENDPOINTS } from '@/api/endpoints'

import { ref, onMounted } from 'vue'
import axios from 'axios'
import PageTitle from '@/Components/common/PageTitle.vue'
import DataTable from '@/Components/Table/DataTable.vue'
import Pagination from '@/Components/Table/Pagination.vue'
import TableAction from '@/Components/Table/TableAction.vue'
import TableEmpty from '@/Components/Table/TableEmpty.vue'
import TableLoading from '@/Components/Table/TableLoading.vue'
import FormInput from '@/Components/Form/FormInput.vue'
import FormCheckbox from '@/Components/Form/FormCheckbox.vue'
import Modal from '@/Components/Modal/Modal.vue'
import ConfirmModal from '@/Components/Modal/ConfirmModal.vue'
import StatusBadge from '@/Components/Badge/StatusBadge.vue'

import useCrud from '@/Composables/useCrud'
import useTable from '@/Composables/useTable'

// --- STATE MANAGEMENT ---
const vendorsData = ref({})
const isFetching = ref(false)

const apiUrl = API_ENDPOINTS.prcVendor

// --- SETUP TABLE ---
const { search, entries } = useTable(
  {
    search: '',
    entries: 10,
  },
  () => fetchVendors(),
)

// --- FETCH DATA ---
const fetchVendors = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
    })
    vendorsData.value = response.data.data
  } catch (error) {
    console.error('Gagal load data vendors', error)
  } finally {
    isFetching.value = false
  }
}

// --- SETUP CRUD COMPOSABLE ---
const {
  form,
  errors,
  showModal,
  showDeleteModal,
  isEdit,
  loading,
  openCreate,
  openEdit,
  closeModal,
  submit,
  openDelete,
  closeDeleteModal,
  confirmDelete,
} = useCrud({
  initialForm: {
    code: '',
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    is_active: true,
  },
  storeRoute: apiUrl,
  updateRoute: apiUrl,
  deleteRoute: apiUrl,
})

// --- LIFECYCLE ---
onMounted(() => {
  fetchVendors()
})

const handleSubmit = () => {
  submit(fetchVendors)
}

const handleDelete = () => {
  confirmDelete(fetchVendors)
}
</script>

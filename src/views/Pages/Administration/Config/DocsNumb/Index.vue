<template>
  <div class="mx-auto max-w-screen-2xl">
    <Breadcrumb pageTitle="Document Numbering" :crumbs="['Administration', 'System Settings']" />

    <DataTable
      :headers="[
        'Module Code',
        'Department',
        'Document Name',
        'Format',
        'Reset Type',
        'Status',
        'Action',
      ]"
      :from="numberingsData.from"
      :to="numberingsData.to"
      :total="numberingsData.total"
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
          Tambah Format
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="6" />

      <tr
        v-else
        v-for="doc in numberingsData.data"
        :key="doc.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center font-medium text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ doc.module }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center font-medium text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ doc.department ? doc.department.name : 'Tidak terdaftar.' }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ doc.name }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center font-mono text-sm font-bold text-primary last:border-r-0 dark:border-strokedark"
        >
          {{ doc.format }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ doc.reset_type }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <StatusBadge :active="doc.is_active" />
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <TableAction
            :show-edit-delete="true"
            @edit="handleEdit(doc)"
            @delete="openDelete(doc.id)"
          />
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!numberingsData.data || numberingsData.data.length === 0)"
        :colspan="6"
      />

      <template #pagination>
        <Pagination :links="numberingsData.links" @change-page="fetchNumberings" />
      </template>
    </DataTable>

    <Modal
      :show="showModal"
      :title="isEdit ? 'Edit Penomoran' : 'Tambah Penomoran'"
      @close="closeModal"
    >
      <div class="p-6 flex flex-col gap-5">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="sm:col-span-1">
            <FormInput
              label="Module Code"
              v-model="form.module"
              :error="errors?.module ? errors.module[0] : null"
              placeholder="e.g., PR"
            />
          </div>
          <div class="sm:col-span-1">
            <FormSelect
              label="Department"
              v-model="form.department"
              :options="departments"
              :error="errors?.department ? errors.department[0] : null"
            />
          </div>
          <div class="sm:col-span-2">
            <FormInput
              label="Document Name"
              v-model="form.name"
              :error="errors?.name ? errors.name[0] : null"
              placeholder="e.g., Purchase Request"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <FormInput
              label="Prefix (Awalan)"
              v-model="form.prefix"
              :error="errors?.prefix ? errors.prefix[0] : null"
              placeholder="e.g., PR"
            />
          </div>
          <div>
            <FormInput
              label="Digit Length"
              type="number"
              v-model="form.digit_length"
              :error="errors?.digit_length ? errors.digit_length[0] : null"
              placeholder="e.g., 4"
            />
          </div>
          <div>
            <FormSelect
              label="Reset Sequence"
              v-model="form.reset_type"
              :options="[
                { id: 'NEVER', name: 'Never' },
                { id: 'YEARLY', name: 'Yearly' },
                { id: 'MONTHLY', name: 'Monthly' },
                { id: 'DAILY', name: 'Daily' },
              ]"
              :error="errors?.reset_type ? errors.reset_type[0] : null"
            />
          </div>
        </div>

        <div class="border-t border-stroke dark:border-strokedark pt-5 mt-1">
          <FormInput
            label="Format Structure"
            v-model="form.format"
            :error="errors?.format ? errors.format[0] : null"
            placeholder="Klik tombol di bawah untuk menyusun format..."
          />

          <div class="mt-3 flex flex-wrap gap-2">
            <button
              @click="insertTag('{PREFIX}')"
              type="button"
              class="text-xs px-2.5 py-1.5 font-medium bg-gray-200 hover:bg-gray-300 dark:bg-meta-4 dark:hover:bg-meta-3 rounded text-black dark:text-white border border-stroke dark:border-strokedark transition-colors"
            >
              + Prefix
            </button>
            <button
              @click="insertTag('{YYYY}')"
              type="button"
              class="text-xs px-2.5 py-1.5 font-medium bg-gray-200 hover:bg-gray-300 dark:bg-meta-4 dark:hover:bg-meta-3 rounded text-black dark:text-white border border-stroke dark:border-strokedark transition-colors"
            >
              + Tahun (YYYY)
            </button>
            <button
              @click="insertTag('{YY}')"
              type="button"
              class="text-xs px-2.5 py-1.5 font-medium bg-gray-200 hover:bg-gray-300 dark:bg-meta-4 dark:hover:bg-meta-3 rounded text-black dark:text-white border border-stroke dark:border-strokedark transition-colors"
            >
              + Tahun (YY)
            </button>
            <button
              @click="insertTag('{MM}')"
              type="button"
              class="text-xs px-2.5 py-1.5 font-medium bg-gray-200 hover:bg-gray-300 dark:bg-meta-4 dark:hover:bg-meta-3 rounded text-black dark:text-white border border-stroke dark:border-strokedark transition-colors"
            >
              + Bulan (MM)
            </button>
            <button
              @click="insertTag('{SEQ}')"
              type="button"
              class="text-xs px-2.5 py-1.5 font-medium bg-primary text-white hover:bg-opacity-90 shadow-sm rounded transition-colors"
            >
              + No. Urut (SEQ)
            </button>
            <div class="w-px bg-stroke dark:bg-strokedark mx-1 h-6 self-center"></div>
            <button
              @click="insertTag('-')"
              type="button"
              class="text-xs px-2.5 py-1.5 font-medium bg-white hover:bg-gray-50 dark:bg-boxdark dark:hover:bg-meta-4 rounded text-black dark:text-white border border-stroke dark:border-strokedark transition-colors"
            >
              Strip ( - )
            </button>
            <button
              @click="insertTag('/')"
              type="button"
              class="text-xs px-2.5 py-1.5 font-medium bg-white hover:bg-gray-50 dark:bg-boxdark dark:hover:bg-meta-4 rounded text-black dark:text-white border border-stroke dark:border-strokedark transition-colors"
            >
              Garis Miring ( / )
            </button>
            <button
              @click="clearFormat"
              type="button"
              class="text-xs px-2.5 py-1.5 font-medium text-danger hover:underline ml-auto"
            >
              Kosongkan Format
            </button>
          </div>
        </div>

        <div class="rounded border border-primary bg-primary/5 p-4 mt-1">
          <p class="text-sm font-medium text-primary mb-1">Live Preview Dokumen:</p>
          <p class="text-xl font-mono font-bold text-black dark:text-white">
            {{ livePreview || 'Pilih format di atas...' }}
          </p>
        </div>

        <FormCheckbox label="Active Status" v-model="form.is_active" class="mt-1" />
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

import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import DataTable from '@/Components/Table/DataTable.vue'
import Pagination from '@/Components/Table/Pagination.vue'
import TableAction from '@/Components/Table/TableAction.vue'
import TableEmpty from '@/Components/Table/TableEmpty.vue'
import TableLoading from '@/Components/Table/TableLoading.vue'
import FormInput from '@/Components/Form/FormInput.vue'
import FormCheckbox from '@/Components/Form/FormCheckbox.vue'
import FormSelect from '@/Components/Form/FormSelect.vue'
import Modal from '@/Components/Modal/Modal.vue'
import ConfirmModal from '@/Components/Modal/ConfirmModal.vue'
import StatusBadge from '@/Components/Badge/StatusBadge.vue'

import useCrud from '@/Composables/useCrud'
import useTable from '@/Composables/useTable'

const numberingsData = ref({})
const isFetching = ref(false)
const departments = ref([])

const apiUrl = API_ENDPOINTS.sysDocnum

const { search, entries } = useTable({ search: '', entries: 10 }, () => fetchNumberings())

const fetchNumberings = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
    })
    numberingsData.value = response.data.data
  } catch (error) {
    console.error('Gagal load data', error)
  } finally {
    isFetching.value = false
  }
}

const apiDept = API_ENDPOINTS.orgDepartment
const fetchDepartments = async () => {
  try {
    const response = await axios.get(apiDept)
    const rawData = response.data.data.data || response.data.data
    departments.value = rawData
  } catch (error) {
    console.error('Gagal mengambil data departemen', error)
  }
}

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
    id: null,
    module: '',
    department: '',
    name: '',
    format: '',
    prefix: '',
    digit_length: 4,
    reset_type: 'YEARLY',
    is_active: true,
  },
  storeRoute: apiUrl,
  updateRoute: apiUrl,
  deleteRoute: apiUrl,
})

// --- HELPER UNTUK EDIT DATA ---
const handleEdit = (doc) => {
  // Ambil ID/Kode department jika berbentuk Object relasi dari Eloquent
  const departmentValue =
    typeof doc.department === 'object' && doc.department !== null
      ? doc.department.id || doc.department.code || ''
      : doc.department

  // Buat payload bersih dengan ID dan format department yang tepat
  const payload = {
    ...doc,
    department: departmentValue,
  }

  openEdit(payload)
}

// --- LOGIKA HELPER BUILDER ---
const insertTag = (tag) => {
  const target = form.value !== undefined ? form.value : form

  if (!target.format) {
    target.format = tag
  } else {
    target.format += tag
  }
}

const clearFormat = () => {
  const target = form.value !== undefined ? form.value : form
  target.format = ''
}

// --- LOGIKA LIVE PREVIEW ---
const livePreview = computed(() => {
  if (!form.format) return ''

  let result = form.format
  const date = new Date()

  const YYYY = date.getFullYear().toString()
  const YY = YYYY.slice(-2)
  const MM = (date.getMonth() + 1).toString().padStart(2, '0')
  const DD = date.getDate().toString().padStart(2, '0')

  const length = parseInt(form.digit_length) || 4
  const SEQ = '1'.padStart(length, '0')

  result = result
    .replace(/{PREFIX}/g, form.prefix || '')
    .replace(/{YYYY}/g, YYYY)
    .replace(/{YY}/g, YY)
    .replace(/{MM}/g, MM)
    .replace(/{DD}/g, DD)
    .replace(/{SEQ}/g, SEQ)

  return result
})

onMounted(() => {
  fetchNumberings()
  fetchDepartments()
})

const handleSubmit = () => {
  submit(fetchNumberings)
}

const handleDelete = () => {
  confirmDelete(fetchNumberings)
}
</script>

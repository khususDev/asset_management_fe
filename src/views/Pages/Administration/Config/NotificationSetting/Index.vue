<template>
  <div class="mx-auto max-w-screen-2xl">
    <Breadcrumb pageTitle="Notification Settings" :crumbs="['Administration', 'System Settings']" />

    <DataTable
      :headers="['Module', 'Event', 'Recipient Role', 'Type', 'Status', 'Action']"
      :from="notificationsData.from"
      :to="notificationsData.to"
      :total="notificationsData.total"
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
          Tambah Notifikasi
        </button>
      </template>

      <TableLoading v-if="isFetching" :rows="5" :cols="6" />

      <tr
        v-else
        v-for="item in notificationsData.data"
        :key="item.id"
        class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
      >
        <td
          class="border-r border-stroke px-4 py-5 text-center font-medium text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ item.module }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-primary font-medium last:border-r-0 dark:border-strokedark"
        >
          {{ item.event }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center text-black dark:text-white last:border-r-0 dark:border-strokedark"
        >
          {{ item.recipient_role }}
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <span
            class="inline-block rounded px-2.5 py-0.5 text-sm font-medium"
            :class="{
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300':
                item.type === 'EMAIL',
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300':
                item.type === 'SYSTEM',
              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300':
                item.type === 'BOTH',
            }"
          >
            {{ item.type }}
          </span>
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <StatusBadge :active="item.is_active" />
        </td>
        <td
          class="border-r border-stroke px-4 py-5 text-center last:border-r-0 dark:border-strokedark"
        >
          <TableAction @edit="openEdit(item)" @delete="openDelete(item.id)" />
        </td>
      </tr>

      <TableEmpty
        v-if="!isFetching && (!notificationsData.data || notificationsData.data.length === 0)"
        :colspan="6"
      />

      <template #pagination>
        <Pagination :links="notificationsData.links" @change-page="fetchNotifications" />
      </template>
    </DataTable>

    <Modal
      :show="showModal"
      :title="isEdit ? 'Edit Notifikasi' : 'Tambah Notifikasi'"
      @close="closeModal"
    >
      <div class="p-6 flex flex-col gap-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Module Name"
            v-model="form.module"
            :error="errors?.module ? errors.module[0] : null"
            placeholder="e.g., Purchase Request"
          />
          <FormInput
            label="Trigger Event"
            v-model="form.event"
            :error="errors?.event ? errors.event[0] : null"
            placeholder="e.g., ON_APPROVE, ON_REJECT"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Recipient Role"
            v-model="form.recipient_role"
            :error="errors?.recipient_role ? errors.recipient_role[0] : null"
            placeholder="e.g., CREATOR, NEXT_APPROVER"
          />
          <FormSelect
            label="Notification Type"
            v-model="form.type"
            :options="[
              { id: 'SYSTEM', name: 'System In-App' },
              { id: 'EMAIL', name: 'Email Only' },
              { id: 'BOTH', name: 'System & Email' },
            ]"
            :error="errors?.type ? errors.type[0] : null"
          />
        </div>

        <div class="border-t border-stroke dark:border-strokedark pt-4 mt-2">
          <FormCheckbox label="Active Status" v-model="form.is_active" />
        </div>
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
import { API_BASE_URL, API_ENDPOINTS } from '@/api/endpoints'

import { ref, onMounted } from 'vue'
import axios from 'axios'

import Breadcrumb from '@/Components/Page/Breadcrumb.vue'
import DataTable from '@/Components/Table/DataTable.vue'
import Pagination from '@/Components/Table/Pagination.vue'
import TableAction from '@/Components/Table/TableAction.vue'
import TableEmpty from '@/Components/Table/TableEmpty.vue'
import TableLoading from '@/Components/Table/TableLoading.vue'
import FormInput from '@/Components/Form/FormInput.vue'
import FormSelect from '@/Components/Form/FormSelect.vue'
import FormCheckbox from '@/Components/Form/FormCheckbox.vue'
import Modal from '@/Components/Modal/Modal.vue'
import ConfirmModal from '@/Components/Modal/ConfirmModal.vue'
import StatusBadge from '@/Components/Badge/StatusBadge.vue'

import useCrud from '@/Composables/useCrud'
import useTable from '@/Composables/useTable'

// --- STATE MANAGEMENT ---
const notificationsData = ref({})
const isFetching = ref(false)

const apiUrl = API_ENDPOINTS.sysNotifSetting

// --- SETUP TABLE ---
const { search, entries } = useTable({ search: '', entries: 10 }, () => fetchNotifications())

// --- FETCH DATA ---
const fetchNotifications = async (url = apiUrl) => {
  isFetching.value = true
  try {
    const response = await axios.get(url, {
      params: { search: search.value, entries: entries.value },
    })
    notificationsData.value = response.data.data
  } catch (error) {
    console.error('Gagal load data notification settings', error)
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
    module: '',
    event: '',
    recipient_role: '',
    type: 'SYSTEM',
    is_active: true,
  },
  storeRoute: apiUrl,
  updateRoute: apiUrl,
  deleteRoute: apiUrl,
})

// --- LIFECYCLE ---
onMounted(() => {
  fetchNotifications()
})

const handleSubmit = () => {
  submit(fetchNotifications)
}

const handleDelete = () => {
  confirmDelete(fetchNotifications)
}
</script>

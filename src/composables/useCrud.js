import { ref } from 'vue'
import apiClient from '@/api/axios'
import { useToastStore } from '@/stores/toast' // <-- 1. Import Store Global Baru

export default function useCrud(config) {
  const toastStore = useToastStore() // <-- 2. Inisialisasi Store Global

  const showModal = ref(false)
  const showDeleteModal = ref(false)
  const isEdit = ref(false)
  const selectedId = ref(null)
  const loading = ref(false)

  // Mengganti useForm Inertia dengan ref biasa
  const form = ref({ ...config.initialForm })
  // State khusus untuk menampung error validasi (422) dari Laravel
  const errors = ref({})

  const openCreate = () => {
    isEdit.value = false
    errors.value = {}
    form.value = { ...config.initialForm }
    showModal.value = true
  }

  const openEdit = (data) => {
    isEdit.value = true
    errors.value = {}
    selectedId.value = data.id
    form.value.id = data.id
    // Copy data ke form
    Object.keys(config.initialForm).forEach((key) => {
      form.value[key] = data[key]
    })
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    errors.value = {}
  }

  const submit = async (onSuccessCallback) => {
    loading.value = true
    errors.value = {}

    try {
      if (isEdit.value) {
        const res = await apiClient.put(`${config.updateRoute}/${selectedId.value}`, form.value)

        // MENGGUNAKAN PESAN GLOBAL SEBAGAI CADANGAN (EDIT)
        toastStore.showToast('success', 'Changes have been updated successfully!', 'edit')
      } else {
        const res = await apiClient.post(config.storeRoute, form.value)

        // MENGGUNAKAN PESAN GLOBAL SEBAGAI CADANGAN (TAMBAH DATA)
        toastStore.showToast('success', 'Data has been saved successfully!', 'check')
      }

      closeModal()
      if (onSuccessCallback) onSuccessCallback()
    } catch (err) {
      if (err.response && err.response.status === 422) {
        errors.value = err.response.data.errors
        // PENGONDISIAN ERROR VALIDASI GLOBAL
        toastStore.showToast('error', 'Invalid input. Please check the required fields.', 'error')
      } else {
        console.error('Gagal menyimpan:', err)
        // PENGONDISIAN ERROR SISTEM GLOBAL
        toastStore.showToast('error', 'A system error occurred. Please try again later.', 'error')
      }
    } finally {
      loading.value = false
    }
  }

  const confirmDelete = async (onSuccessCallback) => {
    try {
      const res = await apiClient.delete(`${config.deleteRoute}/${selectedId.value}`)
      closeDeleteModal()
      if (onSuccessCallback) onSuccessCallback()

      // MENGGUNAKAN PESAN GLOBAL SEBAGAI CADANGAN (HAPUS)
      toastStore.showToast('success', 'Data has been deleted successfully!', 'trash')
    } catch (err) {
      console.error('Failed to delete data:', err)
      toastStore.showToast('error', 'Failed to process request.', err, 'error')
    }
  }

  const openDelete = (id) => {
    selectedId.value = id
    showDeleteModal.value = true
  }

  const closeDeleteModal = () => {
    showDeleteModal.value = false
  }

  return {
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
  }
}

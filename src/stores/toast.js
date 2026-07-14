import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const show = ref(false)
  const type = ref('success')
  const message = ref('')
  const icon = ref('check') // <-- WAJIB ADA: State untuk menyimpan tipe ikon

  let timeoutId = null

  // PERBAIKAN: Fungsi sekarang menerima parameter ke-3 (toastIcon)
  const showToast = (toastType, toastMessage, toastIcon = null) => {
    if (timeoutId) clearTimeout(timeoutId)

    show.value = true
    type.value = toastType
    message.value = toastMessage

    // Jika parameter ke-3 kosong, otomatis pasang ikon 'check' atau 'error'
    icon.value = toastIcon || (toastType === 'success' ? 'check' : 'error')

    timeoutId = setTimeout(() => {
      show.value = false
    }, 4000)
  }

  return { show, type, message, icon, showToast }
})

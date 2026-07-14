import { defineStore } from 'pinia'
import apiClient from '@/api/axios'
import { API_ENDPOINTS } from '@/api/endpoints'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    settings: {
      app_name: 'Asset Management ERP',
      company_name: 'PT. xxx xxx xxx',
      logo_lg: '/images/logo/vue-large.png',
      logo_sm: '/images/logo/vue-small.png',
    },
    loading: false,
  }),

  actions: {
    async fetchSettings() {
      this.loading = true
      try {
        const response = await apiClient.get(API_ENDPOINTS.appSettings)
        if (response.data.success) {
          // Ganti state default dengan data asli dari database Laravel
          this.settings = response.data.data
        }
      } catch (error) {
        console.error('Gagal memuat konfigurasi aplikasi global:', error)
      } finally {
        this.loading = false
      }
    },

    // Fungsi pembantu untuk memperbarui state secara instan setelah admin menekan tombol simpan
    updateLocalSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings }
    },
  },
})

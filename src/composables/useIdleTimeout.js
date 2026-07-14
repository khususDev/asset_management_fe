import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2' // Import SweetAlert2

export function useIdleTimeout(timeoutInMinutes = 60) {
  const authStore = useAuthStore()
  let timeoutId = null
  let countdownInterval = null

  const timeoutInMs = timeoutInMinutes * 60 * 1000

  const logoutUser = () => {
    if (authStore.user) {
      // 1. Bersihkan timer agar tidak looping
      if (timeoutId) clearTimeout(timeoutId)
      if (countdownInterval) clearInterval(countdownInterval)

      // 2. LANGSUNG HAPUS SESI SAAT INI JUGA!
      // Meskipun user belum klik OK, token akses di latar belakang sudah dimusnahkan.
      authStore.logout()

      // 3. Baru tampilkan SweetAlert informasinya
      Swal.fire({
        title: 'Sesi Berakhir!',
        text: `Sesi Anda telah berakhir karena tidak ada aktivitas selama ${timeoutInMinutes} menit.`,
        icon: 'warning',
        confirmButtonText: 'Oke',
        confirmButtonColor: '#3c50e0',
        allowOutsideClick: false,
        allowEscapeKey: false,
      })
    }
  }

  const resetTimer = () => {
    // Jika popup SweetAlert sedang terbuka (user sudah idle), jangan reset timer lagi
    if (Swal.isVisible()) return

    if (timeoutId) clearTimeout(timeoutId)
    if (countdownInterval) clearInterval(countdownInterval)

    timeoutId = setTimeout(logoutUser, timeoutInMs)

    // Fitur console.log untuk debugging (Bisa dihapus nanti jika sudah rilis)
    let timeRemaining = timeoutInMinutes
    console.clear()
    console.log(`[Idle Tracker] Aktivitas terdeteksi! Timer di-reset ke ${timeRemaining} menit.`)

    countdownInterval = setInterval(() => {
      timeRemaining -= 1
      if (timeRemaining > 0) {
        console.log(
          `[Idle Tracker] Anda tidak ada aktivitas. Auto-logout dalam ${timeRemaining} menit...`,
        )
      }
    }, 60000)
  }

  onMounted(() => {
    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('keydown', resetTimer)
    window.addEventListener('click', resetTimer)
    window.addEventListener('scroll', resetTimer)

    resetTimer()
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', resetTimer)
    window.removeEventListener('keydown', resetTimer)
    window.removeEventListener('click', resetTimer)
    window.removeEventListener('scroll', resetTimer)

    if (timeoutId) clearTimeout(timeoutId)
    if (countdownInterval) clearInterval(countdownInterval)
  })
}

import { ref } from 'vue'

const loading = ref(false)

export function useLoading() {
  const startLoading = () => {
    loading.value = true
  }

  const stopLoading = () => {
    loading.value = false
  }

  return {
    loading,
    startLoading,
    stopLoading,
  }
}

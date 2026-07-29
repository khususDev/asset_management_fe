import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { API_BASE_URL } from '@/api/endpoints'

axios.defaults.withCredentials = true
axios.defaults.baseURL = API_BASE_URL
axios.defaults.headers.common.Accept = 'application/json'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

const attachInterceptors = (instance, router) => {
  instance.interceptors.request.use(
    (config) => {
      NProgress.start()
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      NProgress.done()
      return Promise.reject(error)
    },
  )

  instance.interceptors.response.use(
    (response) => {
      NProgress.done()
      return response
    },
    (error) => {
      NProgress.done()
      if (error.response && error.response.status === 401 && router) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('permissions')
        router.push({ name: 'Signin' })
      }
      return Promise.reject(error)
    },
  )
}

const setupAxiosInterceptors = (router) => {
  attachInterceptors(apiClient, router)
  attachInterceptors(axios, router)
}

export { apiClient as default, setupAxiosInterceptors }

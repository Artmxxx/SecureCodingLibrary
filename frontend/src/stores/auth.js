import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

const API_URL = 'http://localhost:3000/api/auth'

axios.defaults.withCredentials = true;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post(`${API_URL}/login`, { email, password })
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(this.user))
        router.push('/')
      } catch (error) {
        throw error.response.data.message
      }
    },
    async register(username, email, password) {
      try {
        const response = await axios.post(`${API_URL}/register`, { username, email, password, role: 'USER' })
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(this.user))
        router.push('/')
      } catch (error) {
        throw error.response?.data?.message || 'Registration failed'
      }
    },
    async logout() {
      await axios.post(`${API_URL}/logout`)
      this.user = null
      localStorage.removeItem('user')
      router.push('/login')
    }
  }
})

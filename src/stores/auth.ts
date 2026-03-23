import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockApi } from '@/mocks/api'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('bext_user') || 'null'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  async function login(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const loggedUser = await mockApi.login(email, password)
      user.value = loggedUser
      localStorage.setItem('bext_user', JSON.stringify(loggedUser))
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erro ao fazer login'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('bext_user')
  }

  return { user, loading, error, isAuthenticated, login, logout }
})

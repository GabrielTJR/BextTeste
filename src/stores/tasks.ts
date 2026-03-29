import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockApi } from '@/mocks/api'
import { useAuthStore } from '@/stores/auth'
import type { Task, Priority, Category, FilterState } from '@/types'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const search = ref<string>('')

  const filters = ref<FilterState>({
    category: 'all',
    priority: 'all',
  })

  const userTasks = computed(() => {
    const authStore = useAuthStore()
    return tasks.value.filter(
      (t) => t.userId === authStore.user?.id || authStore.user?.type === 'admin'
    )
  })

  const filteredTasks = computed(() => {
    return userTasks.value.filter((task) => {
      const matchCategory =
        filters.value.category === 'all' || task.category === filters.value.category
      const matchPriority =
        filters.value.priority === 'all' || task.priority === filters.value.priority
      const matchSearch =
        !search.value || task.title.toLowerCase().includes(search.value.toLowerCase())

      return matchCategory && matchPriority && matchSearch
    })
  })

  const tasksByCategory = computed(() => {
    const categories: Record<Category, Task[]> = { all: [], health: [], work: [], study: [] }
    filteredTasks.value.forEach((task) => {
      categories['all'].push(task)
      categories[task.category].push(task)
    })
    return categories
  })

  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      tasks.value = await mockApi.getTasks()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar tarefas'
    } finally {
      loading.value = false
    }
  }

  async function addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>) {
    const authStore = useAuthStore()
    if (!authStore.user) return
    loading.value = true
    try {
      const newTask = await mockApi.createTask({
        ...taskData,
        userId: authStore.user.id,
      })
      tasks.value.push(newTask)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erro ao criar tarefa'
    } finally {
      loading.value = false
    }
  }

  async function editTask(id: string, updates: Partial<Task>) {
    try {
      const updated = await mockApi.updateTask(id, updates)
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) tasks.value[index] = updated
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erro ao atualizar tarefa'
    }
  }

  async function removeTask(id: string) {
    try {
      await mockApi.deleteTask(id)
      tasks.value = tasks.value.filter((t) => t.id !== id)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erro ao remover tarefa'
    }
  }

  async function toggleComplete(id: string) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) await editTask(id, { completed: !task.completed })
  }

  function setFilter(key: keyof FilterState, value: string) {
    filters.value[key] = value as Priority & Category & 'all'
  }

  function resetFilters() {
    filters.value = { category: 'all', priority: 'all' }
    search.value = ''
  }

  return {
    tasks,
    loading,
    error,
    search,
    filters,
    userTasks,
    filteredTasks,
    tasksByCategory,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    toggleComplete,
    setFilter,
    resetFilters,
  }
})

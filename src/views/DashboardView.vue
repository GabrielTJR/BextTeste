<template>
  <div class="min-h-screen bg-[var(--color-back)] flex flex-col">
    <AppHeader />

    <main class="flex-1 p-6 mx-auto w-full">
      <div class="flex items-center justify-between mb-2">
        <div>
          <span class="text-white">{{ authStore.user?.name }}</span>
          <h1 class="text-xl font-bold text-white">Minhas Tarefas</h1>
        </div>
        <BaseButton variant="primary" size="md" @click="openCreateModal">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nova tarefa
        </BaseButton>
      </div>

      <div
        v-if="showFormModal === false && showDetailModal === false"
        class="flex flex-col md:flex-row"
      >
        <div class="border-0 border-gray-300 p-3 md:border-t md:border-r">
          <FilterBar />
        </div>
        <div v-if="taskStore.loading" class="flex justify-center py-20">
          <span
            class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"
          />
        </div>
        <div
          v-else
          class="w-full grid grid-cols-1 md:grid-cols-3 gap-6 border-0 border-gray-300 p-3 md:border-t"
        >
          <TaskList
            v-for="cat in filteredCategories"
            :key="cat"
            :category="cat"
            :tasks="taskStore.tasksByCategory[cat]"
            @view="openDetailModal"
            @edit="openEditModal"
            @delete="handleDelete"
            @toggle="taskStore.toggleComplete"
            class="bg-white shadow-md shadow-black hover:shadow-white rounded-xl border border-gray-100 px-4 py-3 mb-6 md:min-w-1/3"
          />
        </div>
      </div>
      <div v-else-if="showFormModal" class="flex justify-center w-full">
        <TaskForm
          :task="selectedTask"
          :loading="taskStore.loading"
          @submit="handleFormSubmit"
          @cancel="showFormModal = false"
          class="gap-6 border-0 border-gray-300 p-3 md:border-t w-1/3"
        />
      </div>
      <div v-else class="flex justify-center w-full">
        <TaskDetail
          :task="selectedTask"
          @deleted="showDetailModal = false"
          class="gap-6 border-0 border-gray-300 p-3 md:border-t w-1/3"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FilterBar from '@/components/tasks/FilterBar.vue'
import TaskList from '@/components/tasks/TaskList.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import TaskDetail from '@/components/tasks/TaskDetail.vue'
import type { Task, Category } from '@/types'

const authStore = useAuthStore()
const taskStore = useTaskStore()
const categories: Category[] = ['health', 'work', 'study']

const showFormModal = ref(false)
const showDetailModal = ref(false)
const selectedTask = ref<Task | null>(null)

const today = computed(() =>
  new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
)

const filteredCategories = computed(() => {
  return categories.filter(
    (cat) => taskStore.filters.category === 'all' || taskStore.filters.category === cat
  )
})

onMounted(() => taskStore.fetchTasks())

function openCreateModal() {
  selectedTask.value = null
  showFormModal.value = true
}

function openEditModal(task: Task) {
  selectedTask.value = task
  showFormModal.value = true
}

function openDetailModal(task: Task) {
  selectedTask.value = task
  showDetailModal.value = true
}

async function handleFormSubmit(data: Omit<Task, 'id' | 'createdAt' | 'userId'>) {
  if (selectedTask.value) {
    await taskStore.editTask(selectedTask.value.id, data)
  } else {
    await taskStore.addTask(data)
  }
  showFormModal.value = false
  selectedTask.value = null
}

async function handleDelete(id: string) {
  await taskStore.removeTask(id)
}
</script>

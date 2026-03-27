<template>
  <div class="min-h-screen bg-[var(--color-back)] flex flex-col">
    <AppHeader />

    <main class="flex-1 mx-auto w-full">
      <div class="flex flex-col md:flex-row">
        <div
          class="flex flex-col border-0 pt-4 border-gray-500 w-full md:w-1/6 p-3 md:border-t md:border-r"
        >
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
          <FilterBar />
        </div>
        <div v-if="taskStore.loading" class="flex justify-center py-20">
          <span
            class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"
          />
        </div>
        <div
          v-else
          class="w-full flex flex-col md:grid-cols-3 gap-3 border-0 border-gray-500 p-3 md:border-t"
        >
          <div>
            <span class="text-white">{{ authStore.user?.name }}</span>
            <h1 class="text-xl font-bold text-white">Minhas Tarefas</h1>
          </div>
          <TaskList
            v-for="cat in filteredCategories"
            :key="cat"
            :priority="taskStore.filters.priority"
            :category="cat"
            :tasks="taskStore.tasksByCategory[cat]"
            @view="openDetailModal"
            @edit="openEditModal"
            @delete="handleDelete"
            @toggle="taskStore.toggleComplete"
            class="px-4 py-3 mb-6 md:min-w-1/3"
          />
        </div>
      </div>
    </main>

    <BaseShow
      v-model="showFormModal"
      :title="selectedTask ? 'Editar Tarefa' : 'Nova Tarefa'"
      size="md"
    >
      <TaskForm
        :task="selectedTask"
        :loading="taskStore.loading"
        @submit="handleFormSubmit"
        @cancel="showFormModal = false"
      />
    </BaseShow>
    <BaseShow
      v-model="showDetailModal"
      :title="isEditingDetail ? 'Editar tarefa' : 'Detalhes Tarefa'"
      size="md"
    >
      <TaskDetail
        v-model="showDetailModal"
        :task="selectedTask"
        @deleted="showDetailModal = false"
        @editing="isEditingDetail = $event"
      />
    </BaseShow>
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
import BaseShow from '@/components/ui/BaseShow.vue'
import type { Task, Category } from '@/types'

const authStore = useAuthStore()
const taskStore = useTaskStore()
const categories: Category[] = ['all', 'health', 'work', 'study']

const showFormModal = ref(false)
const showDetailModal = ref(false)
const selectedTask = ref<Task | null>(null)
const isEditingDetail = ref(false)

const today = computed(() =>
  new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
)

const filteredCategories = computed(() => {
  return categories.filter((cat) => taskStore.filters.category === cat)
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

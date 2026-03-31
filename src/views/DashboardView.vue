<template>
  <div class="min-h-screen md:h-screen bg-[var(--color-back)] flex flex-col">
    <AppHeader />

    <main class="flex-1 mx-auto w-full min-h-0 flex flex-col">
      <div class="flex flex-col md:flex-row flex-1 min-h-0">
        <div
          class="flex flex-col border-0 pt-4 border-gray-500 w-full md:w-1/6 p-3 md:border-t md:border-r"
        >
          <BaseButton class="mb-4" variant="primary" size="md" @click="openCreateModal">
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
          class="w-full flex flex-col gap-3 border-0 border-gray-500 md:border-t min-h-0 h-full flex-1 min-h-0"
        >
          <div class="flex flex-row justify-between items-center p-3">
            <h1 class="text-xl font-bold text-white w-1/4">Minhas Tarefas</h1>
            <div class="w-1/2 justify-center flex flex-row items-center">
              <BaseInput
                v-model="taskStore.search"
                type="text"
                :icon="true"
                placeholder="Filtrar tarefa"
                inputClass="bg-[var(--color-back-card)] text-white"
                ><template #icon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="24"
                    height="24"
                    class="text-white"
                    viewBox="0 0 30 30"
                  >
                    <path
                      d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </template>
              </BaseInput>
            </div>
            <span class="text-white w-1/4 text-end">{{ authStore.user?.name }}</span>
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
            :showMode="showMode"
            @changeMode="showMode = $event"
            class="md:min-w-1/3 h-full"
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
import type { Task, Category, ShowMode } from '@/types'
import BaseInput from '@/components/ui/BaseInput.vue'

const authStore = useAuthStore()
const taskStore = useTaskStore()
const categories: Category[] = ['all', 'health', 'work', 'study']
const showMode = ref<ShowMode>('list')
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

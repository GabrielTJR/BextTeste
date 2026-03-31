<template>
  <div
    class="group bg-[var(--color-back-card)] rounded-xl border border-gray-500 transition-all duration-200 cursor-pointer', 'hover:shadow-md hover:-translate-y-0.5"
    :class="task.completed ? 'opacity-50 border-green-500' : 'hover:border-gray-200'"
    @click="$emit('view', task)"
  >
    <div class="p-4 h-full flex flex-col justify-between">
      <div class="flex items-start justify-between gap-2 mb-2">
        <div class="flex items-start gap-2 min-w-0">
          <h3
            :class="[
              'text-sm font-semibold leading-snug break-words truncate',
              task.completed ? 'line-through text-white' : 'text-white',
            ]"
          >
            {{ task.title }}
          </h3>
          <span
            v-if="task.completed"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-green-500"
          >
            Concluído
          </span>
        </div>

        <div
          class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        >
          <button
            class="p-1 rounded text-white hover:text-primary hover:bg-blue-50 transition-colors"
            title="Editar"
            @click.stop="$emit('edit', task)"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            class="p-1 rounded text-white hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Excluir"
            @click.stop="askDelete"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button
            class="rounded text-white hover:text-green-500 hover:bg-green-50 hover:text-green-500 transition-colors"
            :title="task.completed ? 'Reabrir' : 'Concluir'"
            @click.stop="askComplete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <BaseConfirm
            :task="taskToConfirm"
            :type="confirmType"
            @confirm="handleConfirm"
            @cancel="taskToConfirm = null"
          />
        </div>
      </div>

      <p v-if="task.description" class="text-xs text-white mb-3 line-clamp-2">
        {{ task.description }}
      </p>

      <div class="footer flex items-center justify-between">
        <div class="flex flex-row w-full justify-between gap-0.5">
          <PriorityBadge class="w-max" :priority="task.priority" />
          <span v-if="isAdmin" class="text-xs text-white italic"> Usuário: {{ taskOwner }} </span>
          <span
            v-if="task.dueDate"
            class="flex items-center gap-1 text-xs font-mono"
            :class="isOverdue ? 'text-red-500 font-semibold' : 'text-white'"
          >
            <svg
              v-if="isOverdue"
              class="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ formatDate(task.dueDate) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PriorityBadge from '../ui/PriorityBadge.vue'
import BaseConfirm from '../ui/BaseConfirm.vue'
import type { Task } from '@/types'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import { MOCK_USERS } from '@/mocks/api'

const props = defineProps<{ task: Task }>()
defineEmits<{
  view: [task: Task]
  edit: [task: Task]
  delete: [id: string]
  toggle: [id: string]
}>()

const today = new Date().toISOString().split('T')[0]

const taskToConfirm = ref<Task | null>(null)
const confirmType = ref<'delete' | 'complete'>('delete')

const isOverdue = computed(
  () => !props.task.completed && !!props.task.dueDate && props.task.dueDate < today
)

const taskStore = useTaskStore()
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.user?.type === 'admin')

const taskOwner = computed(
  () => MOCK_USERS.find((u) => u.id === props.task.userId)?.name ?? 'Desconhecido'
)

function askDelete() {
  confirmType.value = 'delete'
  taskToConfirm.value = props.task
}

function askComplete() {
  confirmType.value = 'complete'
  taskToConfirm.value = props.task
}

async function handleConfirm() {
  if (confirmType.value === 'delete') {
    await handleDelete()
  } else {
    await taskStore.toggleComplete(props.task!.id)
  }
  taskToConfirm.value = null
}

async function handleDelete() {
  await taskStore.removeTask(props.task.id)
}

function formatDate(date: string): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}
</script>

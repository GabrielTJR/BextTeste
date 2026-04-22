<template>
  <div v-if="task" class="flex flex-col gap-4 p-3">
    <div v-if="!isEditing">
      <div class="flex flex-col gap-4">
        <div class="flex items-start text-black flex-col gap-1">
          <p>Título:</p>
          <h3
            :class="[
              'text-xl font-semibold',
              task.completed ? 'line-through text-gray-400' : 'text-black',
            ]"
          >
            {{ task.title }}
          </h3>
        </div>

        <div class="flex flex-col text-black gap-1">
          <p>Prioridade:</p>
          <PriorityBadge class="w-max" :priority="task.priority" />
        </div>
        <p v-if="task.description" class="text-sm text-black leading-relaxed break-words">
          Descrição: <br />{{ task.description }}
        </p>

        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 rounded-xl bg-background">
            <p class="text-xs text-gray mb-1">Categoria</p>
            <p class="text-sm font-medium text-dark">{{ categoryLabel[task.category] }}</p>
          </div>
          <div class="p-3 rounded-xl bg-background">
            <p class="text-xs text-gray mb-1">Status</p>
            <p
              class="text-sm font-medium"
              :class="task.completed ? 'text-green-600' : 'text-yellow-600'"
            >
              {{ task.completed ? 'Concluída' : 'Em andamento' }}
            </p>
          </div>
          <div class="p-3 rounded-xl bg-background">
            <p class="text-xs text-gray mb-1">Criada em</p>
            <p class="text-sm font-medium text-dark font-mono">{{ formatDate(task.createdAt) }}</p>
          </div>
          <div v-if="task.dueDate" class="p-3 rounded-xl bg-background">
            <p class="text-xs text-gray mb-1">Prazo</p>
            <p class="text-sm font-medium text-dark font-mono">{{ formatDate(task.dueDate) }}</p>
          </div>
        </div>

        <div class="flex justify-between items-center pt-2">
          <BaseButton type="button" variant="ghost" size="sm" @click="$emit('deleted')"
            >Cancelar</BaseButton
          >

          <BaseButton variant="danger" size="sm" @click="askDelete">Excluir</BaseButton>

          <BaseButton
            variant="primary"
            size="sm"
            @click="
              () => {
                isEditing = true
                emit('editing', true)
              }
            "
            >Editar tarefa</BaseButton
          >
          <BaseConfirm
            :task="taskToConfirm"
            :type="confirmType"
            @confirm="handleConfirm"
            @cancel="taskToConfirm = null"
          />
        </div>
      </div>
    </div>

    <TaskForm
      v-else
      :task="task"
      :loading="loading"
      @submit="handleUpdate"
      @cancel="
        () => {
          isEditing = false
          emit('editing', false)
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import PriorityBadge from '@/components/ui/PriorityBadge.vue'
import BaseConfirm from '../ui/BaseConfirm.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import { useTaskStore } from '@/stores/tasks'
import type { Task, Category } from '@/types'

interface Props {
  task: Task | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  deleted: []
  editing: [value: boolean]
}>()

const taskStore = useTaskStore()
const isEditing = ref(false)
const loading = ref(false)

const taskToConfirm = ref<Task | null>(null)
const confirmType = ref<'delete' | 'complete'>('delete')

const categoryLabel: Record<Category, string> = {
  all: 'Todas',
  health: 'Saúde',
  work: 'Trabalho',
  study: 'Estudo',
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function askDelete() {
  confirmType.value = 'delete'
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

async function handleUpdate(data: Omit<Task, 'id' | 'createdAt' | 'userId'>) {
  if (!props.task) return
  loading.value = true
  await taskStore.editTask(props.task.id, data)
  loading.value = false
  isEditing.value = false
}

async function handleDelete() {
  if (!props.task) return
  await taskStore.removeTask(props.task.id)
  emit('deleted')
}
</script>

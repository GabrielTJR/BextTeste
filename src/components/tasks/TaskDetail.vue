<template>
  <div v-if="task" class="flex flex-col gap-4 p-3">
    <div v-if="!isEditing">
      <div class="flex flex-col gap-4">
        <div class="flex items-start justify-between gap-3">
          <h3
            :class="[
              'text-xl font-semibold',
              task.completed ? 'line-through text-gray-400' : 'text-white',
            ]"
          >
            Título: <br />{{ task.title }}
          </h3>
          <PriorityBadge :priority="task.priority" />
        </div>

        <p v-if="task.description" class="text-sm text-white leading-relaxed break-words">
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
          <div v-if="task.dueDate" class="p-3 rounded-xl bg-background">
            <p class="text-xs text-gray mb-1">Prazo</p>
            <p class="text-sm font-medium text-dark font-mono">{{ formatDate(task.dueDate) }}</p>
          </div>
          <div class="p-3 rounded-xl bg-background">
            <p class="text-xs text-gray mb-1">Criada em</p>
            <p class="text-sm font-medium text-dark font-mono">{{ formatDate(task.createdAt) }}</p>
          </div>
        </div>

        <div class="flex justify-between items-center pt-2">
          <BaseButton variant="danger" size="sm" @click="handleDelete">Excluir</BaseButton>

          <BaseButton type="button" variant="ghost" size="md" @click="$emit('deleted')"
            >Cancelar</BaseButton
          >
          <BaseButton variant="primary" size="sm" @click="isEditing = true"
            >Editar tarefa</BaseButton
          >
        </div>
      </div>
    </div>

    <TaskForm
      v-else
      :task="task"
      :loading="loading"
      @submit="handleUpdate"
      @cancel="isEditing = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import PriorityBadge from '@/components/ui/PriorityBadge.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import { useTaskStore } from '@/stores/tasks'
import type { Task, Category } from '@/types'

interface Props {
  task: Task | null
}

const props = defineProps<Props>()
const emit = defineEmits<{ deleted: [] }>()

const taskStore = useTaskStore()
const isEditing = ref(false)
const loading = ref(false)

const categoryLabel: Record<Category, string> = {
  personal: 'Pessoal',
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

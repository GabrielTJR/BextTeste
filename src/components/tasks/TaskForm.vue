<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <BaseInput
      v-model="form.title"
      label="Título"
      placeholder="Ex: Revisar relatório"
      required
      :error="errors.title"
      maxlength="60"
    />

    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-white">Descrição</label>
      <textarea
        v-model="form.description"
        placeholder="Detalhes da tarefa..."
        rows="3"
        class="shadow-white shadow-md w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none resize-none placeholder:text-gray-400"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <BaseSelect
        v-model="form.category"
        label="Categoria"
        required
        :options="categoryOptions"
        :error="errors.category"
      />
      <BaseSelect
        v-model="form.priority"
        label="Prioridade"
        required
        :options="priorityOptions"
        :error="errors.priority"
      />
    </div>

    <BaseInput
      v-model="form.dueDate"
      label="Prazo de Conclusão"
      type="date"
      :error="errors.dt_conclusao"
    />

    <div class="flex items-center gap-2 pt-1">
      <input
        id="completed-check"
        v-model="form.completed"
        type="checkbox"
        class="w-4 h-4 rounded border-gray-300 text-white focus:ring-primary cursor-pointer accent-primary"
      />
      <label for="completed-check" class="text-sm text-white cursor-pointer"
        >Marcar como concluída</label
      >
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <BaseButton type="button" variant="ghost" size="md" @click="$emit('cancel')">
        Cancelar
      </BaseButton>
      <BaseButton type="submit" variant="primary" size="md" :loading="loading">
        {{ isEditing ? 'Salvar alterações' : 'Criar tarefa' }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { Task } from '@/types'

interface Props {
  task?: Task | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), { task: null, loading: false })
const emit = defineEmits<{
  submit: [data: Omit<Task, 'id' | 'createdAt' | 'userId'>]
  cancel: []
}>()

const isEditing = computed(() => !!props.task)

const defaultForm = () => ({
  title: '',
  description: '',
  priority: 'medium' as Task['priority'],
  category: 'work' as Task['category'],
  dueDate: '',
  completed: false,
})

const today = new Date().toISOString().split('T')[0]

const form = reactive(defaultForm())
const errors = reactive({ title: '', category: '', priority: '', dt_conclusao: '' })

watch(
  () => props.task,
  (task) => {
    if (task) {
      form.title = task.title
      form.description = task.description
      form.priority = task.priority
      form.category = task.category
      form.dueDate = task.dueDate || ''
      form.completed = task.completed
    } else {
      Object.assign(form, defaultForm())
    }
  },
  { immediate: true }
)

const categoryOptions = [
  { value: 'health', label: 'Saúde' },
  { value: 'work', label: 'Trabalho' },
  { value: 'study', label: 'Estudo' },
]

const priorityOptions = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
]

function validate(): boolean {
  errors.title = !form.title.trim()
    ? 'O título é obrigatório'
    : form.title.length > 60
      ? 'O título deve ter no máximo 60 caracteres'
      : ''
  errors.category = form.category ? '' : 'Selecione uma categoria'
  errors.priority = form.priority ? '' : 'Selecione uma prioridade'
  errors.dt_conclusao =
    form.dueDate === '' || form.dueDate > today ? '' : 'Data de conclusão inválida'
  return !errors.title && !errors.category && !errors.priority && !errors.dt_conclusao
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    priority: form.priority,
    category: form.category,
    dueDate: form.dueDate || null,
    completed: form.completed,
  })
}
</script>

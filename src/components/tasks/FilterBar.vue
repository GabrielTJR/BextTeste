<template>
  <div class="flex flex-col items-left gap-3">
    <div
      class="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-xs shadow-black hover:shadow-xl transition-shadow duration-300"
    >
      <h3 class="text-lg p-2">Categoria</h3>
      <div class="flex flex-row items-left gap-1 flex-wrap mb-6 md:flex-col">
        <button
          v-for="opt in categoryOptions"
          :key="opt.value"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-150',
            filters.category === opt.value
              ? 'bg-dark text-white border-dark'
              : 'bg-white text-dark border-gray-200 hover:border-dark',
          ]"
          @click="taskStore.setFilter('category', opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div
      class="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-xs shadow-black hover:shadow-xl transition-shadow duration-300"
    >
      <h3 class="text-lg p-2">Prioridade</h3>
      <div class="flex flex-row items-left gap-1 flex-wrap mb-6 md:flex-col">
        <button
          v-for="opt in priorityOptions"
          :key="opt.value"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-150',
            filters.priority === opt.value
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-dark border-gray-200 hover:border-primary',
          ]"
          @click="taskStore.setFilter('priority', opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <button
      v-if="filters.category !== 'all' || filters.priority !== 'all'"
      class="ml-auto text-xs text-gray-400 hover:text-red-500 transition-colors underline"
      @click="taskStore.resetFilters"
    >
      Limpar filtros
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'

const taskStore = useTaskStore()
const { filters } = storeToRefs(taskStore)

const categoryOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'personal', label: 'Pessoal' },
  { value: 'work', label: 'Trabalho' },
  { value: 'study', label: 'Estudo' },
]

const priorityOptions = [
  { value: 'all', label: 'Todas' },
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
]
</script>

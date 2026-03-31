<template>
  <div class="flex flex-col items-left min-h-0 h-full min-h-0 md:overflow-auto">
    <h3 class="text-lg p-2 text-white">Categoria</h3>
    <div class="flex flex-row items-left gap-1 flex-wrap mb-4 md:flex-col">
      <button
        v-for="opt in categoryOptions"
        :key="opt.value"
        :class="[
          'px-3 py-1.5 text-sm font-bold rounded-xl transition-all duration-150 flex flex-row items-center',
          filters.category === opt.value
            ? 'bg-[var(--color-back-card)] text-white border border-gray-200'
            : 'bg-none text-gray-500 border border-transparent hover:border-gray-200',
        ]"
        @click="taskStore.setFilter('category', opt.value)"
      >
        <img
          :src="imgCategory[opt.value].img"
          class="h-6 w-6 mr-6 text-white"
          :class="{ 'opacity-50': filters.category !== opt.value }"
        />
        {{ opt.label }}
      </button>
    </div>
    <h3 class="text-lg text-white p-2">Prioridade</h3>
    <div class="flex flex-row items-left gap-1 flex-wrap mb-4 md:flex-col">
      <button
        v-for="opt in priorityOptions"
        :key="opt.value"
        :class="[
          'px-3 py-1.5 text-sm font-bold rounded-xl transition-all duration-150 flex flex-row items-center',
          filters.priority === opt.value
            ? 'bg-[var(--color-back-card)] text-white border border-gray-200'
            : 'bg-none text-gray-500 border border-transparent hover:border-gray-200',
        ]"
        @click="taskStore.setFilter('priority', opt.value)"
      >
        <img
          :src="imgPriority[opt.value].img"
          class="h-6 w-6 mr-6 text-white"
          :class="{ 'opacity-50': filters.priority !== opt.value }"
        />
        {{ opt.label }}
      </button>
    </div>

    <button
      v-if="filters.category !== 'all' || filters.priority !== 'all' || taskStore.search !== ''"
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
import type { Category, Priority } from '@/types'

const taskStore = useTaskStore()
const { filters } = storeToRefs(taskStore)

const categoryOptions: { value: Category; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'health', label: 'Saúde' },
  { value: 'work', label: 'Trabalho' },
  { value: 'study', label: 'Estudo' },
]

const imgCategory: Record<Category, { img: string }> = {
  all: { img: '/all.png' },
  health: { img: '/health.png' },
  work: { img: '/work.png' },
  study: { img: '/study.png' },
}

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
]

const imgPriority: Record<Priority, { img: string }> = {
  all: { img: '/all-priority.png' },
  low: { img: '/low.png' },
  medium: { img: '/medium.png' },
  high: { img: '/high.png' },
}
</script>

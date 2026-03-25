<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="task"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('cancel')"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <div class="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
          <div class="flex flex-col gap-4">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="type === 'delete' ? 'bg-red-100' : 'bg-primary/10'"
            >
              <svg
                v-if="type === 'delete'"
                class="w-5 h-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5 text-primary"
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
            </div>

            <div>
              <p class="text-base font-semibold text-dark">
                {{
                  type === 'delete'
                    ? 'Excluir tarefa?'
                    : props.task?.completed === false
                      ? 'Concluir tarefa?'
                      : 'Reabrir Tarefa?'
                }}
              </p>
            </div>

            <div class="flex justify-end gap-2 pt-1">
              <BaseButton variant="ghost" size="sm" @click="$emit('cancel')"> Cancelar </BaseButton>
              <BaseButton
                :variant="type === 'delete' ? 'danger' : 'primary'"
                size="sm"
                @click="$emit('confirm')"
              >
                {{
                  type === 'delete'
                    ? 'Excluir'
                    : props.task?.completed === false
                      ? 'Concluir'
                      : 'Reabrir'
                }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Task } from '@/types'
import BaseButton from './BaseButton.vue'

interface Props {
  task: Task | null
  type: 'delete' | 'complete'
}

const props = defineProps<Props>()
defineEmits<{
  cancel: []
  confirm: []
}>()
</script>

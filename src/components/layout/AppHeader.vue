<template>
  <header class="bg-back text-black px-4 sm:px-6 py-4 flex items-center justify-between shadow-md">
    <div class="flex items-center gap-3">
      <span class="font-semibold text-lg tracking-tight">Gerenciador de Tarefas</span>
    </div>
    <div class="flex items-center gap-3">
      <span class="hidden sm:block text-sm">{{ authStore.user?.name }}</span>
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm -300 hover:text-white hover:bg-white/10 transition-colors"
        @click="handleLogout"
      >
        <span class="hidden sm:inline">Sair</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const taskStore = useTaskStore()
const router = useRouter()
const { userTasks } = storeToRefs(taskStore)

const pendingCount = computed(() => userTasks.value.filter((t) => !t.completed).length)
const completedCount = computed(() => userTasks.value.filter((t) => t.completed).length)

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

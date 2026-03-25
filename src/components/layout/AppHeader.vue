<template>
  <header
    class="text-white px-4 sm:px-6 py-4 flex items-center justify-between shadow-md shadow-white"
  >
    <div class="flex items-center gap-3">
      <img src="/favicon.png" class="w-auto h-8" />
    </div>
    <div class="flex items-center gap-3">
      <h1 class="font-semibold text-3xl tracking-tight">Gerenciador de Tarefas</h1>
    </div>
    <div class="flex items-center gap-3">
      <span class="hidden sm:block text-base">{{ authStore.user?.name }}</span>
      <button
        class="bg-primary text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-base -300 hover:bg-primary-dark transition-colors"
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

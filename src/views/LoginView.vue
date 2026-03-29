<template>
  <div class="min-h-screen flex justify-between">
    <div class="hidden md:flex w-full h-screen flex justify-center">
      <img src="../../favicon.png" class="w-auto h-screen" />
    </div>
    <div class="md:border border-gray-400 w-full flex flex-col justify-center h-screen md:max-w-sm">
      <div class="text-center mb-4">
        <h1 class="text-2xl font-bold text-black">Gerenciado de Tarefas</h1>
      </div>

      <div class="w-full shadow-sm p-8">
        <h2 class="text-lg font-semibold text-black mb-6">Entrar na plataforma</h2>

        <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
          <BaseInput
            v-model="email"
            label="E-mail"
            type="email"
            required
            :error="fieldErrors.email"
          />
          <BaseInput
            v-model="password"
            label="Senha"
            type="password"
            required
            :error="fieldErrors.password"
          />

          <Transition name="slide-up">
            <div
              v-if="authStore.error"
              class="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm"
            >
              <svg
                class="w-4 h-4 flex-shrink-0"
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
              {{ authStore.error }}
            </div>
          </Transition>

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="authStore.loading"
            class="w-full mt-2"
          >
            Entrar
          </BaseButton>
        </form>

        <div
          class="mt-6 p-3 rounded-lg bg-background border border-gray-100 text-xs text-gray-500 space-y-0.5"
        >
          <p class="font-medium text-dark text-xs mb-1">Credenciais de teste:</p>
          <p>
            <span class="font-mono">gabriel@bext.vc</span> / <span class="font-mono">123456</span>
          </p>
          <p>
            <span class="font-mono">user2@bext.vc</span> / <span class="font-mono">123456</span>
          </p>
          <p>
            <span class="font-mono">admin@bext.vc</span> / <span class="font-mono">admin123</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const fieldErrors = reactive({ email: '', password: '' })

function validate(): boolean {
  fieldErrors.email = email.value.trim() ? '' : 'Informe seu e-mail'
  fieldErrors.password = password.value.trim() ? '' : 'Informe sua senha'
  return !fieldErrors.email && !fieldErrors.password
}

async function handleLogin() {
  if (!validate()) return
  const success = await authStore.login(email.value, password.value)
  if (success) router.push({ name: 'dashboard' })
}
</script>

import type { Task, User } from '@/types'

export const MOCK_USERS: User[] = [
  { id: 1, email: 'gabriel@bext.vc', password: '123456', name: 'Gabriel Toscano', type: 'user' },
  { id: 2, email: 'user2@bext.vc', password: '123456', name: 'Usuário 2', type: 'user' },
  { id: 3, email: 'admin@bext.vc', password: 'admin123', name: 'Admin Bext', type: 'admin' },
]

const SEED_TASKS: Task[] = [
  {
    id: '1',
    userId: 1,
    title: 'Revisar relatório mensal',
    description: 'Verificar os dados de desempenho e consolidar o relatório para envio.',
    priority: 'high',
    category: 'work',
    dueDate: '2026-03-25',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 1,
    title: 'Estudar Vue 3 Composition API',
    description: 'Aprender sobre composables e o novo sistema de reatividade.',
    priority: 'medium',
    category: 'study',
    dueDate: '2026-03-28',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: 1,
    title: 'Academia',
    description: 'Treino de musculação — foco em membros superiores.',
    priority: 'low',
    category: 'health',
    dueDate: null,
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    userId: 2,
    title: 'Reunião com equipe de produto',
    description: 'Alinhar prioridades para o próximo sprint.',
    priority: 'high',
    category: 'work',
    dueDate: '2026-03-21',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    userId: 2,
    title: 'Ler livro Clean Code',
    description: 'Capítulos 5 a 8 sobre funções e comentários.',
    priority: 'low',
    category: 'study',
    dueDate: '2026-04-01',
    completed: false,
    createdAt: new Date().toISOString(),
  },
]

const STORAGE_KEY = 'bext_tasks'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockApi = {
  async getTasks(): Promise<Task[]> {
    await delay()
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TASKS))
      return SEED_TASKS
    }
    return JSON.parse(stored)
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    await delay()
    const tasks = await this.getTasks()
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    tasks.push(newTask)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    return newTask
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await delay()
    const tasks = await this.getTasks()
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) throw new Error('Task not found')
    tasks[index] = { ...tasks[index], ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    return tasks[index]
  },

  async deleteTask(id: string): Promise<void> {
    await delay()
    const tasks = await this.getTasks()
    const filtered = tasks.filter((t) => t.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  },

  async login(email: string, password: string): Promise<User> {
    await delay(400)
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password)
    if (!user) throw new Error('Credenciais inválidas')
    return user
  },
}

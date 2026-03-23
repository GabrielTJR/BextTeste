export type Priority = 'low' | 'medium' | 'high'
export type Category = 'personal' | 'work' | 'study'
export type TypeUser = 'user' | 'admin'

export interface Task {
  id: string
  userId: number
  title: string
  description: string
  priority: Priority
  category: Category
  dueDate: string | null
  completed: boolean
  createdAt: string
}

export interface User {
  id: number
  email: string
  password: string
  name: string
  type: TypeUser
}

export interface FilterState {
  category: Category | 'all'
  priority: Priority | 'all'
}

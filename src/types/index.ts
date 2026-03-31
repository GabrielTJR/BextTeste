export type Priority = 'low' | 'medium' | 'high' | 'all'
export type Category = 'health' | 'work' | 'study' | 'all'
export type TypeUser = 'user' | 'admin'
export type ShowMode = 'list' | 'grid'

export interface Task {
  id: number
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
  category: Category
  priority: Priority
}

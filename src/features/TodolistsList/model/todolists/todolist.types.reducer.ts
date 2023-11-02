import { RequestStatus } from 'app/app.reducer'

export type Filter = 'all' | 'active' | 'completed'
export type Todolist = {
  id: string
  title: string
  addedDate: string
  order: number
}
export type UpdateTodolistArgs = {
  todolistId: string,
  title: string
}
export type TodolistDomain = Todolist & {
  filter: Filter
  entityStatus: RequestStatus
}
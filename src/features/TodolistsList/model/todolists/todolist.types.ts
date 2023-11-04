import { RequestStatus } from 'app/app.slice'

export type TodolistOrigin = {
  id: string
  title: string
  addedDate: string
  order: number
}
export type UpdateTodolistArgs = {
  todolistId: string,
  title: string
}
export type TodolistFilterButton = 'all' | 'active' | 'completed'
export type TodolistDomain = TodolistOrigin & {
  filter: TodolistFilterButton
  entityStatus: RequestStatus
}
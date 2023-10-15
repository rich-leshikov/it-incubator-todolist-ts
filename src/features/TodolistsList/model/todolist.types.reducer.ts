import { Todolist } from 'features/TodolistsList/api/todolist.types.api'
import { RequestStatus } from 'app/app-reducer'

export type Filter = 'all' | 'active' | 'completed'
export type TodolistDomain = Todolist & {
  filter: Filter
  entityStatus: RequestStatus
}
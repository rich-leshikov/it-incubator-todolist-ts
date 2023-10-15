import { TaskPriorities, TaskStatuses } from 'common/enums'
import { TaskDomain, UpdateDomainTaskModel } from 'features/TodolistsList/model/task.types'

export type Todolist = {
  id: string
  title: string
  addedDate: string
  order: number
}
export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
export type UpdateTaskModelType = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}
export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: TaskType[]
}
export type FetchTasksArgs = {
  tasks: TaskDomain[],
  todolistId: string
}
export type AddTaskArgs = {
  taskTitle: string
  todolistId: string
}
export type RemoveTaskArgs = {
  taskId: string
  todolistId: string
}
export type UpdateTaskArgs = {
  taskId: string
  todolistId: string
  domainModel: UpdateDomainTaskModel
}
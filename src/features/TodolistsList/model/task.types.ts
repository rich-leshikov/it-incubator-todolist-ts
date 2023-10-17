import { TaskPriorities, TaskStatuses } from 'common/enums'
import { TaskType } from 'features/TodolistsList/api/todolist.types.api'
import { RequestStatus } from 'app/app.reducer'

export type TaskDomain = TaskType & {
  entityStatus: RequestStatus
}
export type TasksState = {
  [key: string]: Array<TaskDomain>
}
export type UpdateDomainTaskModel = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
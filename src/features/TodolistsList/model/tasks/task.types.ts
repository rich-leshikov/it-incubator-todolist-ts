import { TaskPriorities, TaskStatuses } from 'common/enums'
import { RequestStatus } from 'app/app.slice'

export type TaskOrigin = {
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
export type TaskDomain = TaskOrigin & {
  entityStatus: RequestStatus
}
export type TasksState = Record<string, TaskDomain[]>
export type UpdateDomainTaskModel = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
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
  items: TaskOrigin[]
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
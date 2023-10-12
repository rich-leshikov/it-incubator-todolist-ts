import axios, { AxiosResponse } from 'axios'
import { UpdateDomainTaskModel } from 'features/TodolistsList/tasks-reducer'

// axios instance
export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    'API-KEY': '99bd0ff6-13b6-4774-a7f5-1bbc0224aa2f'
  }
})

// API
export const authAPI = {
  login: (data: LoginParams) => {
    return instance.post<ResponseType<{ userId: number }>>('auth/login', data)
  },
  logout: () => {
    return instance.delete<ResponseType>('auth/login')
  },
  me: () => {
    return instance.get<ResponseType<AuthMe>>('auth/me')
  }
}

export const todolistsAPI = {
  getTodolists: () => {
    return instance.get<Todolist[]>('todo-lists')
  },
  addTodolist: (title: string) => {
    return instance.post<ResponseType<{ item: Todolist }>,
      AxiosResponse<ResponseType<{ item: Todolist }>>,
      { title: string }>('todo-lists', { title })
  },
  removeTodolist: (id: string) => {
    return instance.delete<ResponseType>(`todo-lists/${id}`)
  },
  updateTodolist: (id: string, title: string) => {
    return instance.put<ResponseType, AxiosResponse<ResponseType>, { title: string }>(`todo-lists/${id}`, { title })
  },
  getTasks: (todolistId: string) => {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  addTask: (arg: AddTaskArgs) => {
    return instance.post<ResponseType<{ item: TaskType }>,
      AxiosResponse<ResponseType<{ item: TaskType }>>,
      { title: string }>(`todo-lists/${arg.todolistId}/tasks`, { title: arg.taskTitle })
  },
  removeTask: (arg: RemoveTaskArgs) => {
    return instance.delete<ResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`)
  },
  updateTask: (todolistId: string, taskId: string, model: UpdateTaskModelType) => {
    return instance.put<ResponseType<{ item: TaskType }>,
      AxiosResponse<ResponseType<{ item: TaskType }>>,
      UpdateTaskModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  }
}

// enums
export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4
}

// types
export type LoginParams = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}
export type AuthMe = {
  id: number
  email: string
  login: string
}
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
export type ResponseType<D = {}> = {
  resultCode: number
  messages: Array<string>
  data: D
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

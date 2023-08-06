import axios, {AxiosResponse} from 'axios'


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
  login: (data: LoginParamsType) => {
    return instance.post<ResponseType<{ userId: number }>>('auth/login', data)
  },
  me: () => {
    return instance.get<ResponseType<AuthMeType>>('auth/me')
  }
}

export const todolistAPI = {
  getTodolists: () => {
    return instance.get<TodolistType[]>('todo-lists')
  },
  addTodolist: (title: string) => {
    return instance.post<ResponseType<{ item: TodolistType }>, AxiosResponse<ResponseType<{ item: TodolistType }>>, { title: string }>('todo-lists', {title})
  },
  removeTodolist: (id: string) => {
    return instance.delete<ResponseType>(`todo-lists/${id}`)
  },
  updateTodolist: (id: string, title: string) => {
    return instance.put<ResponseType, AxiosResponse<ResponseType>, { title: string }>(`todo-lists/${id}`, {title})
  },
  getTasks: (todolistId: string) => {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  addTask: (todolistId: string, taskTitle: string) => {
    return instance.post<ResponseType<{ item: TaskType }>, AxiosResponse<ResponseType<{ item: TaskType }>>, { title: string }>(`todo-lists/${todolistId}/tasks`, {title: taskTitle})
  },
  removeTask: (todolistId: string, taskId: string) => {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  updateTask: (todolistId: string, taskId: string, model: UpdateTaskModelType) => {
    return instance.put<ResponseType<{ item: TaskType }>, AxiosResponse<ResponseType<{ item: TaskType }>>, UpdateTaskModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
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
export type LoginParamsType = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}
export type AuthMeType = {
  id: number
  email: string
  login: string
}
export type TodolistType = {
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
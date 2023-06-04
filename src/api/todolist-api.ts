import axios, {AxiosResponse} from 'axios';


export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}
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
type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: TaskType[]
}
type ResponseType<D = {}> = {
  resultCode: number
  messages: Array<string>
  data: D
}


export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    'API-KEY': '99bd0ff6-13b6-4774-a7f5-1bbc0224aa2f'
  }
})


export const todolistAPI = {
  getTodolists: () => {
    return instance.get<TodolistType[]>('todo-lists')
  },
  createTodolist: (title: string) => {
    return instance.post<ResponseType<{ item: TodolistType }>, AxiosResponse<ResponseType<{ item: TodolistType }>>, { title: string }>('todo-lists', {title: title})
  },
  deleteTodolist: (id: string) => {
    return instance.delete<ResponseType>(`/todo-lists/${id}`)
  },
  updateTodolist: (id: string, title: string) => {
    return instance.put<ResponseType, AxiosResponse<ResponseType>, { title: string }>(`/todo-lists/${id}`, {title: title})
  },
  getTasks: (todolistId: string) => {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask: (todolistId: string, taskTitle: string) => {
    return instance.post<ResponseType<{ item: TaskType }>, AxiosResponse<ResponseType<{ item: TaskType }>>, { title: string }>(`/todo-lists/${todolistId}/tasks`, {title: taskTitle})
  },
  deleteTask: (todolistId: string, taskId: string) => {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
  updateTask: (todolistId: string, taskId: string, model: UpdateTaskModelType) => {
    return instance.put<ResponseType<{ item: TaskType }>, AxiosResponse<ResponseType<{ item: TaskType }>>, UpdateTaskModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  }
}
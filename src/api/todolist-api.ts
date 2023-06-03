import axios from 'axios';


export type TodolistType = {
  id: string
  addedDate: string
  order: number
  title: string
}
export type TaskType = {
  description: string
  title: string
  completed: boolean
  status: number
  priority: number
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
type TaskModelType = {
  title: string
  description: string
  completed: boolean
  status: number
  priority: number
  startDate: string
  deadline: string
}
type ResponseType<D = {}> = {
  resultCode: number
  messages: Array<string>
  fieldsErrors?: Array<string>
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
  getTodolists: () => instance.get<TodolistType[]>('todo-lists'),
  createTodolist: (title: string) => instance.post<ResponseType<{item: TodolistType}>>('todo-lists', {title: title}),
  updateTodolist: (id: string, title: string) => instance.put<ResponseType>(`/todo-lists/${id}`, {title: title}),
  deleteTodolist: (id: string) => instance.delete<ResponseType>(`/todo-lists/${id}`),
  getTasks: (todolistId: string) => instance.get<TaskType[]>(`/todo-lists/${todolistId}/tasks`),
  createTask: (todolistId: string, taskTitle: string) => {
    return instance.post<ResponseType<{item: TaskType}>>(`/todo-lists/${todolistId}/tasks`, {title: taskTitle})
  },
  updateTask: (todolistId: string, taskId: string, taskTitle: string) => {
    return instance.put<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`, {title: taskTitle})
  },
  deleteTask: (todolistId: string, taskId: string) => {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  }
}
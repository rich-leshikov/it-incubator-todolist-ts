import axios from 'axios';


type TodolistType = {
  id: string
  addedDate: string
  order: number
  title: string
}
type ResponseType<D = {}> = {
  resultCode: number
  messages: Array<string>
  fieldsErrors: Array<string>
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
  deleteTodolist: (id: string) => instance.delete<ResponseType>(`/todo-lists/${id}`),
  updateTodolist: (id: string, title: string) => instance.put<ResponseType>(`/todo-lists/${id}`, {title: title})
}
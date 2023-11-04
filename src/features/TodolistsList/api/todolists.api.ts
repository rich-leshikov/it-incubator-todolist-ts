import { AxiosResponse } from 'axios'
import { BaseResponse, instance } from 'common/api/common.api'
import { TodolistOrigin } from 'features/TodolistsList/model/todolists/todolist.types.reducer'

export const todolistsApi = {
  getTodolists: () => {
    return instance.get<TodolistOrigin[]>('todo-lists')
  },
  addTodolist: (title: string) => {
    return instance.post<BaseResponse<{ item: TodolistOrigin }>,
      AxiosResponse<BaseResponse<{ item: TodolistOrigin }>>,
      { title: string }>('todo-lists', { title })
  },
  removeTodolist: (id: string) => {
    return instance.delete<BaseResponse>(`todo-lists/${id}`)
  },
  updateTodolist: (id: string, title: string) => {
    return instance.put<BaseResponse, AxiosResponse<BaseResponse>, { title: string }>(`todo-lists/${id}`, { title })
  }
}

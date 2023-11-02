import { AxiosResponse } from 'axios'
import { BaseResponseType, instance } from 'common/api/common.api'
import { TodolistOrigin } from 'features/TodolistsList/model/todolists/todolist.types.reducer'

export const todolistsApi = {
  getTodolists: () => {
    return instance.get<TodolistOrigin[]>('todo-lists')
  },
  addTodolist: (title: string) => {
    return instance.post<BaseResponseType<{ item: TodolistOrigin }>,
      AxiosResponse<BaseResponseType<{ item: TodolistOrigin }>>,
      { title: string }>('todo-lists', { title })
  },
  removeTodolist: (id: string) => {
    return instance.delete<BaseResponseType>(`todo-lists/${id}`)
  },
  updateTodolist: (id: string, title: string) => {
    return instance.put<BaseResponseType, AxiosResponse<BaseResponseType>, { title: string }>(`todo-lists/${id}`, { title })
  }
}

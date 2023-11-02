import { AxiosResponse } from 'axios'
import { BaseResponseType, instance } from 'common/api/common.api'
import { Todolist } from 'features/TodolistsList/model/todolists/todolist.types.reducer'

export const todolistsApi = {
  getTodolists: () => {
    return instance.get<Todolist[]>('todo-lists')
  },
  addTodolist: (title: string) => {
    return instance.post<BaseResponseType<{ item: Todolist }>,
      AxiosResponse<BaseResponseType<{ item: Todolist }>>,
      { title: string }>('todo-lists', { title })
  },
  removeTodolist: (id: string) => {
    return instance.delete<BaseResponseType>(`todo-lists/${id}`)
  },
  updateTodolist: (id: string, title: string) => {
    return instance.put<BaseResponseType, AxiosResponse<BaseResponseType>, { title: string }>(`todo-lists/${id}`, { title })
  }
}

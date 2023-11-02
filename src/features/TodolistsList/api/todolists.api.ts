import { AxiosResponse } from 'axios'
import { instance, ResponseType } from 'common/api/common.api'
import {
  AddTaskArgs,
  GetTasksResponse,
  RemoveTaskArgs, TaskType,
  UpdateTaskModelType
} from 'features/TodolistsList/model/tasks/task.types'
import { Todolist } from 'features/TodolistsList/model/todolists/todolist.types.reducer'

export const todolistsApi = {
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
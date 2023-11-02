import { AxiosResponse } from 'axios'
import { instance, BaseResponseType } from 'common/api/common.api'
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
    return instance.post<BaseResponseType<{ item: Todolist }>,
      AxiosResponse<BaseResponseType<{ item: Todolist }>>,
      { title: string }>('todo-lists', { title })
  },
  removeTodolist: (id: string) => {
    return instance.delete<BaseResponseType>(`todo-lists/${id}`)
  },
  updateTodolist: (id: string, title: string) => {
    return instance.put<BaseResponseType, AxiosResponse<BaseResponseType>, { title: string }>(`todo-lists/${id}`, { title })
  },
  getTasks: (todolistId: string) => {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  addTask: (arg: AddTaskArgs) => {
    return instance.post<BaseResponseType<{ item: TaskType }>,
      AxiosResponse<BaseResponseType<{ item: TaskType }>>,
      { title: string }>(`todo-lists/${arg.todolistId}/tasks`, { title: arg.taskTitle })
  },
  removeTask: (arg: RemoveTaskArgs) => {
    return instance.delete<BaseResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`)
  },
  updateTask: (todolistId: string, taskId: string, model: UpdateTaskModelType) => {
    return instance.put<BaseResponseType<{ item: TaskType }>,
      AxiosResponse<BaseResponseType<{ item: TaskType }>>,
      UpdateTaskModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  }
}
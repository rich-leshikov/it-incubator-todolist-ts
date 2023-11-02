import { BaseResponseType, instance } from 'common/api/common.api'
import {
  AddTaskArgs,
  GetTasksResponse,
  RemoveTaskArgs,
  TaskType,
  UpdateTaskModelType
} from 'features/TodolistsList/model/tasks/task.types'
import { AxiosResponse } from 'axios'

export const tasksApi = {
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
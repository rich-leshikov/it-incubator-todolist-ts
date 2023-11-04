import { BaseResponse, instance } from 'common/api/common.api'
import {
  AddTaskArgs,
  GetTasksResponse,
  RemoveTaskArgs,
  TaskOrigin,
  UpdateTaskModelType
} from 'features/TodolistsList/model/tasks/task.types'
import { AxiosResponse } from 'axios'

export const tasksApi = {
  getTasks: (todolistId: string) => {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  addTask: (arg: AddTaskArgs) => {
    return instance.post<BaseResponse<{ item: TaskOrigin }>,
      AxiosResponse<BaseResponse<{ item: TaskOrigin }>>,
      { title: string }>(`todo-lists/${arg.todolistId}/tasks`, { title: arg.taskTitle })
  },
  removeTask: (arg: RemoveTaskArgs) => {
    return instance.delete<BaseResponse>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`)
  },
  updateTask: (todolistId: string, taskId: string, model: UpdateTaskModelType) => {
    return instance.put<BaseResponse<{ item: TaskOrigin }>,
      AxiosResponse<BaseResponse<{ item: TaskOrigin }>>,
      UpdateTaskModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  }
}
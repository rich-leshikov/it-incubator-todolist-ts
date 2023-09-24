import { TaskPriorities, TaskStatuses, TaskType, todolistAPI } from 'api/todolist-api'
import { Dispatch } from 'redux'
import { AppRootStateType } from 'app/store'
import { appActions, RequestStatusType } from 'app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { todolistsActions } from 'features/TodolistsList/todolists-reducer'

const slice = createSlice({
  name: 'tasks',
  initialState: {} as TasksStateType,
  reducers: {
    setTasks: (state, action: PayloadAction<{ tasks: Array<TaskDomainType>, todolistId: string }>) => {
      state[action.payload.todolistId] = action.payload.tasks
    },
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      state[action.payload.task.todoListId].unshift({ ...action.payload.task, entityStatus: 'idle' })
    },
    removeTask: (state, action: PayloadAction<{ taskId: string, todolistId: string }>) => {
      const tasks = state[action.payload.todolistId]
      const idx = tasks.findIndex(t => t.id === action.payload.taskId)
      if (idx > -1) tasks.splice(idx, 1)
    },
    updateTask: (state, action: PayloadAction<{
      taskId: string,
      model: UpdateDomainTaskModelType,
      todolistId: string
    }>) => {
      const tasks = state[action.payload.todolistId]
      let index = tasks.findIndex(task => task.id === action.payload.taskId)
      if (index > -1) tasks[index] = { ...tasks[index], ...action.payload.model }
    },
    changeTaskEntityStatus: (state, action: PayloadAction<{
      taskId: string,
      entityStatus: RequestStatusType,
      todolistId: string
    }>) => {
      const tasks = state[action.payload.todolistId]
      let index = tasks.findIndex(task => task.id === action.payload.taskId)
      if (index > -1) tasks[index].entityStatus = action.payload.entityStatus
    }
  },
  extraReducers: builder => {
    builder
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.id]
      })
  }
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }))
  todolistAPI.getTasks(todolistId)
    .then(res => {
      const resData: TaskDomainType[] = res.data.items.map(task => ({ ...task, entityStatus: 'idle' }))
      dispatch(tasksActions.setTasks({ tasks: resData, todolistId }))
      dispatch(appActions.setAppStatus({ status: 'succeeded' }))
    })
    .catch(err => handleServerNetworkError(err, dispatch))
}
export const addTaskTC = (taskTitle: string, todolistId: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }))
  todolistAPI.addTask(todolistId, taskTitle)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(tasksActions.addTask({ task: res.data.data.item }))
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(err => handleServerNetworkError(err, dispatch))
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
  // debugger
  dispatch(appActions.setAppStatus({ status: 'loading' }))
  dispatch(tasksActions.changeTaskEntityStatus({ taskId, entityStatus: 'loading', todolistId }))
  todolistAPI.removeTask(todolistId, taskId)
    .then(() => {
      dispatch(tasksActions.removeTask({ taskId, todolistId }))
      dispatch(appActions.setAppStatus({ status: 'succeeded' }))
    })
    .catch(err => {
      handleServerNetworkError(err, dispatch)
      dispatch(tasksActions.changeTaskEntityStatus({ taskId, entityStatus: 'failed', todolistId }))
    })
}
export const updateTaskTC = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskModelType) =>
  (dispatch: Dispatch, getState: () => AppRootStateType) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    dispatch(tasksActions.changeTaskEntityStatus({ taskId, entityStatus: 'loading', todolistId }))
    const task = getState().tasks[todolistId].find(t => t.id === taskId)

    if (!task) {
      throw new Error('Task not found')
    }

    todolistAPI.updateTask(todolistId, taskId, {
      title: task.title,
      startDate: task.startDate,
      priority: task.priority,
      description: task.description,
      deadline: task.deadline,
      status: task.status,
      ...domainModel
    })
      .then(res => {
        if (res.data.resultCode === 0) {
          dispatch(tasksActions.updateTask({ taskId, model: domainModel, todolistId }))
          dispatch(appActions.setAppStatus({ status: 'succeeded' }))
          dispatch(tasksActions.changeTaskEntityStatus({ taskId, entityStatus: 'succeeded', todolistId }))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch(err => {
        handleServerNetworkError(err, dispatch)
        dispatch(tasksActions.changeTaskEntityStatus({ taskId, entityStatus: 'failed', todolistId }))
      })
  }

// types
export type TaskDomainType = TaskType & {
  entityStatus: RequestStatusType
}
export type TasksStateType = {
  [key: string]: Array<TaskDomainType>
}
type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}

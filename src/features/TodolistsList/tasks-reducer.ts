import { AddTaskArgs, TaskPriorities, TaskStatuses, TaskType, todolistsAPI } from 'api/todolists-api'
import { AppRootStateType, AppThunkDispatchType } from 'app/store'
import { appActions, RequestStatus } from 'app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { todolistsActions } from 'features/TodolistsList/todolists-reducer'
import { createAppAsyncThunk } from 'utils/create-app-async-thunk'

// thunks
export const fetchTasks = createAppAsyncThunk<{ tasks: TaskDomain[], todolistId: string }, string>('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  try {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    const res = await todolistsAPI.getTasks(todolistId)
    const tasks: TaskDomain[] = res.data.items.map(task => ({ ...task, entityStatus: 'idle' }))

    dispatch(appActions.setAppStatus({ status: 'succeeded' }))
    return { tasks, todolistId }
  } catch (err) {
    handleServerNetworkError(err, dispatch)
    return rejectWithValue(null)
  }
})
export const addTask = createAppAsyncThunk<{task: TaskType}, AddTaskArgs>('tasks/addTask', async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  try {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    const res = await todolistsAPI.addTask(arg)
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      return { task: res.data.data.item }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch)
    return rejectWithValue(null)
  }
})


export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: AppThunkDispatchType) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }))
  dispatch(tasksActions.changeTaskEntityStatus({ taskId, entityStatus: 'loading', todolistId }))
  todolistsAPI.removeTask(todolistId, taskId)
    .then(() => {
      dispatch(tasksActions.removeTask({ taskId, todolistId }))
      dispatch(appActions.setAppStatus({ status: 'succeeded' }))
    })
    .catch(err => {
      handleServerNetworkError(err, dispatch)
      dispatch(tasksActions.changeTaskEntityStatus({ taskId, entityStatus: 'failed', todolistId }))
    })
}
export const updateTask = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskModel) =>
  (dispatch: AppThunkDispatchType, getState: () => AppRootStateType) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    dispatch(tasksActions.changeTaskEntityStatus({ taskId, entityStatus: 'loading', todolistId }))
    const task = getState().tasks[todolistId].find(t => t.id === taskId)

    if (!task) {
      throw new Error('Task not found')
    }

    todolistsAPI.updateTask(todolistId, taskId, {
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

const slice = createSlice({
  name: 'tasks',
  initialState: {} as TasksState,
  reducers: {
    removeTask: (state, action: PayloadAction<{ taskId: string, todolistId: string }>) => {
      const tasks = state[action.payload.todolistId]
      const idx = tasks.findIndex(task => task.id === action.payload.taskId)
      if (idx > -1) tasks.splice(idx, 1)
    },
    updateTask: (state, action: PayloadAction<{
      taskId: string,
      model: UpdateDomainTaskModel,
      todolistId: string
    }>) => {
      const tasks = state[action.payload.todolistId]
      let idx = tasks.findIndex(task => task.id === action.payload.taskId)
      if (idx > -1) tasks[idx] = { ...tasks[idx], ...action.payload.model }
    },
    changeTaskEntityStatus: (state, action: PayloadAction<{
      taskId: string,
      entityStatus: RequestStatus,
      todolistId: string
    }>) => {
      const tasks = state[action.payload.todolistId]
      let idx = tasks.findIndex(task => task.id === action.payload.taskId)
      if (idx > -1) tasks[idx].entityStatus = action.payload.entityStatus
    }
  },
  extraReducers: builder => {
    builder
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(todolistsActions.clearTodolists, () => {
        return {}
      })
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift({ ...action.payload.task, entityStatus: 'idle' })
      })
  }
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = { fetchTasks, addTask }

// types
export type TaskDomain = TaskType & {
  entityStatus: RequestStatus
}
export type TasksState = {
  [key: string]: Array<TaskDomain>
}
type UpdateDomainTaskModel = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}

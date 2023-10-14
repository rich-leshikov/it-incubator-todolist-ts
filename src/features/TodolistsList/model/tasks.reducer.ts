import { todolistsApi } from 'features/TodolistsList/api/todolists.api'
import { appActions, RequestStatus } from 'app/app-reducer'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from 'common/utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { todolistsActions } from 'features/TodolistsList/model/todolists.reducer'
import { AddTaskArgs, RemoveTaskArgs, TaskType, UpdateTaskArgs } from 'features/TodolistsList/api/todolist.types.api'
import { TaskDomain, TasksState } from 'features/TodolistsList/model/task.types'

// thunks
export const fetchTasks = createAppAsyncThunk<{ tasks: TaskDomain[], todolistId: string }, string>('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  try {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    const res = await todolistsApi.getTasks(todolistId)
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
    const res = await todolistsApi.addTask(arg)
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
export const removeTask = createAppAsyncThunk<RemoveTaskArgs, RemoveTaskArgs>('tasks/removeTask', async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  try {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    dispatch(tasksActions.changeTaskEntityStatus({ taskId: arg.taskId, entityStatus: 'loading', todolistId: arg.todolistId }))

    const res = await todolistsApi.removeTask(arg)

    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      dispatch(tasksActions.changeTaskEntityStatus({ taskId: arg.taskId, entityStatus: 'succeeded', todolistId: arg.todolistId }))

      return { taskId: arg.taskId, todolistId: arg.todolistId }
    } else {
      handleServerAppError(res.data, dispatch)
      dispatch(tasksActions.changeTaskEntityStatus({ taskId: arg.taskId, entityStatus: 'failed', todolistId: arg.todolistId }))

      return rejectWithValue(null)
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch)
    dispatch(tasksActions.changeTaskEntityStatus({ taskId: arg.taskId, entityStatus: 'failed', todolistId: arg.todolistId }))

    return rejectWithValue(null)
  }
})
export const updateTask = createAppAsyncThunk<UpdateTaskArgs, UpdateTaskArgs>('tasks/updateTask', async (arg, thunkAPI) => {
  const { dispatch, getState, rejectWithValue } = thunkAPI

  try {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    dispatch(tasksActions.changeTaskEntityStatus({ taskId: arg.taskId, entityStatus: 'loading', todolistId: arg.todolistId }))

    const task = getState().tasks[arg.todolistId].find(t => t.id === arg.taskId)
    if (!task) {
      dispatch(appActions.setAppError({error: 'Task not found'}))
      dispatch(tasksActions.changeTaskEntityStatus({ taskId: arg.taskId, entityStatus: 'failed', todolistId: arg.todolistId }))
      return rejectWithValue(null)
    }

    const res = await todolistsApi.updateTask(arg.todolistId, arg.taskId, {
      title: task.title,
      startDate: task.startDate,
      priority: task.priority,
      description: task.description,
      deadline: task.deadline,
      status: task.status,
      ...arg.domainModel
    })

    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      dispatch(tasksActions.changeTaskEntityStatus({ taskId: arg.taskId, entityStatus: 'succeeded', todolistId: arg.todolistId }))
      return arg
    } else {
      handleServerAppError(res.data, dispatch)
      dispatch(tasksActions.changeTaskEntityStatus({ taskId: arg.taskId, entityStatus: 'failed', todolistId: arg.todolistId }))
      return rejectWithValue(null)
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch)
    dispatch(tasksActions.changeTaskEntityStatus({ taskId: arg.taskId, entityStatus: 'failed', todolistId: arg.todolistId }))
    return rejectWithValue(null)
  }
})

const slice = createSlice({
  name: 'tasks',
  initialState: {} as TasksState,
  reducers: {
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
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const idx = tasks.findIndex(task => task.id === action.payload.taskId)
        if (idx > -1) tasks.splice(idx, 1)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const idx = tasks.findIndex(task => task.id === action.payload.taskId)
        if (idx > -1) tasks[idx] = { ...tasks[idx], ...action.payload.domainModel }
      })
  }
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = { fetchTasks, addTask, removeTask, updateTask }


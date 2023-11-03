import { appActions, RequestStatus } from 'app/app.reducer'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch } from 'common/utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { todolistsActions, todolistsThunks } from 'features/TodolistsList/model/todolists/todolists.reducer'
import {
  AddTaskArgs,
  FetchTasksArgs,
  RemoveTaskArgs,
  TaskDomain,
  TasksState,
  TaskOrigin,
  UpdateTaskArgs
} from 'features/TodolistsList/model/tasks/task.types'
import { ResultCode } from 'common/enums'
import { tasksApi } from 'features/TodolistsList/api/tasks.api'

const fetchTasks = createAppAsyncThunk<FetchTasksArgs, string>(
  'tasks/fetchTasks',
  async (todolistId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    try {
      dispatch(appActions.setAppStatus({ status: 'loading' }))
      const res = await tasksApi.getTasks(todolistId)
      const tasks: TaskDomain[] = res.data.items.map(task => ({ ...task, entityStatus: 'idle' }))

      dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      return { tasks, todolistId }
    } catch (err) {
      handleServerNetworkError(err, dispatch)
      return rejectWithValue(null)
    }
  })
const addTask = createAppAsyncThunk<{ task: TaskOrigin }, AddTaskArgs>(
  'tasks/addTask',
  async (param, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    return thunkTryCatch(thunkAPI, async () => {
      const res = await tasksApi.addTask(param)

      if (res.data.resultCode === ResultCode.Success) {
        return { task: res.data.data.item }
      } else {
        handleServerAppError(res.data, dispatch, false)
        return rejectWithValue(res.data)
      }
    })
  }
)
const removeTask = createAppAsyncThunk<RemoveTaskArgs, RemoveTaskArgs>(
  'tasks/removeTask',
  async (param, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    try {
      dispatch(appActions.setAppStatus({ status: 'loading' }))
      dispatch(tasksActions.changeTaskEntityStatus({
        taskId: param.taskId,
        entityStatus: 'loading',
        todolistId: param.todolistId
      }))

      const res = await tasksApi.removeTask(param)

      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        dispatch(tasksActions.changeTaskEntityStatus({
          taskId: param.taskId,
          entityStatus: 'succeeded',
          todolistId: param.todolistId
        }))

        return param
      } else {
        handleServerAppError(res.data, dispatch)
        dispatch(tasksActions.changeTaskEntityStatus({
          taskId: param.taskId,
          entityStatus: 'failed',
          todolistId: param.todolistId
        }))

        return rejectWithValue(null)
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch)
      dispatch(tasksActions.changeTaskEntityStatus({
        taskId: param.taskId,
        entityStatus: 'failed',
        todolistId: param.todolistId
      }))

      return rejectWithValue(null)
    }
  })
const updateTask = createAppAsyncThunk<UpdateTaskArgs, UpdateTaskArgs>(
  'tasks/updateTask',
  async (param, thunkAPI) => {
    const { dispatch, getState, rejectWithValue } = thunkAPI

    try {
      dispatch(appActions.setAppStatus({ status: 'loading' }))
      dispatch(tasksActions.changeTaskEntityStatus({
        taskId: param.taskId,
        entityStatus: 'loading',
        todolistId: param.todolistId
      }))

      const task = getState().tasks[param.todolistId].find(t => t.id === param.taskId)
      if (!task) {
        dispatch(appActions.setAppError({ error: 'Task not found' }))
        dispatch(tasksActions.changeTaskEntityStatus({
          taskId: param.taskId,
          entityStatus: 'failed',
          todolistId: param.todolistId
        }))
        return rejectWithValue(null)
      }

      const res = await tasksApi.updateTask(param.todolistId, param.taskId, {
        title: task.title,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        status: task.status,
        ...param.domainModel
      })

      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        dispatch(tasksActions.changeTaskEntityStatus({
          taskId: param.taskId,
          entityStatus: 'succeeded',
          todolistId: param.todolistId
        }))
        return param
      } else {
        handleServerAppError(res.data, dispatch)
        dispatch(tasksActions.changeTaskEntityStatus({
          taskId: param.taskId,
          entityStatus: 'failed',
          todolistId: param.todolistId
        }))
        return rejectWithValue(null)
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch)
      dispatch(tasksActions.changeTaskEntityStatus({
        taskId: param.taskId,
        entityStatus: 'failed',
        todolistId: param.todolistId
      }))
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
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(todolistsActions.clearTodolists, () => {
        return {}
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(tasksThunks.fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(tasksThunks.addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift({ ...action.payload.task, entityStatus: 'idle' })
      })
      .addCase(tasksThunks.removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const idx = tasks.findIndex(task => task.id === action.payload.taskId)
        if (idx > -1) tasks.splice(idx, 1)
      })
      .addCase(tasksThunks.updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const idx = tasks.findIndex(task => task.id === action.payload.taskId)
        if (idx > -1) tasks[idx] = { ...tasks[idx], ...action.payload.domainModel }
      })
  }
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = { fetchTasks, addTask, removeTask, updateTask }
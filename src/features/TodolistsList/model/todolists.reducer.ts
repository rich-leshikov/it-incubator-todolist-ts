import { todolistsApi } from 'features/TodolistsList/api/todolists.api'
import { appActions, RequestStatus } from 'app/app-reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { tasksThunks } from 'features/TodolistsList/model/tasks.reducer'
import { AppThunkDispatchType } from 'app/store'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from 'common/utils'
import { Todolist, UpdateTodolistArgs } from 'features/TodolistsList/api/todolist.types.api'
import { Filter, TodolistDomain } from 'features/TodolistsList/model/todolist.types.reducer'
import { ResultCode } from 'common/enums'

const fetchTodolists = createAppAsyncThunk('todolists/fetchTodolists', async (params, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  try {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    const res = await todolistsApi.getTodolists()
    const resData: TodolistDomain[] = res.data.map(tl => ({ ...tl, filter: 'all', entityStatus: 'idle' }))

    dispatch(appActions.setAppStatus({ status: 'succeeded' }))
    resData.forEach(tl => dispatch(tasksThunks.fetchTasks(tl.id))) // should dispatch after todolists had markuped
    return { todolists: resData }
  } catch (err) {
    handleServerNetworkError(err, dispatch)
    return rejectWithValue(null)
  }
})
const addTodolist = createAppAsyncThunk<{ todolist: Todolist }, string>('todolists/addTodolist', async (title: string, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  try {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    const res = await todolistsApi.addTodolist(title)

    if (res.data.resultCode === ResultCode.Success) {
      dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      return { todolist: res.data.data.item }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch)
    return rejectWithValue(null)
  }
})
const removeTodolist = createAppAsyncThunk<{ id: string }, string>('todolists/removeTodolist', async (todolistId, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  try {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: 'loading' }))
    const res = await todolistsApi.removeTodolist(todolistId)

    if (res.data.resultCode === ResultCode.Success) {
      dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: 'succeeded' }))
      return { id: todolistId }
    } else {
      handleServerAppError(res.data, dispatch)
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: 'failed' }))
      return rejectWithValue(null)
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch)
    dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: 'failed' }))
    return rejectWithValue(null)
  }
})
const updateTodolist = createAppAsyncThunk<UpdateTodolistArgs, UpdateTodolistArgs>('todolists/updateTodolist', async (params, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  try {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    dispatch(todolistsActions.changeTodolistEntityStatus({ id: params.todolistId, entityStatus: 'loading' }))
    const res = await todolistsApi.updateTodolist(params.todolistId, params.title)

    if (res.data.resultCode === ResultCode.Success) {
      dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: params.todolistId, entityStatus: 'succeeded' }))
      return params
    } else {
      handleServerAppError(res.data, dispatch)
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: params.todolistId, entityStatus: 'failed' }))
      return rejectWithValue(null)
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch)
    dispatch(todolistsActions.changeTodolistEntityStatus({ id: params.todolistId, entityStatus: 'failed' }))
    return rejectWithValue(null)
  }
})

const slice = createSlice({
  name: 'todolists',
  initialState: [] as TodolistDomain[],
  reducers: {
    clearTodolists: () => {
      return []
    },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: Filter }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id)
      if (todo) todo.filter = action.payload.filter
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatus }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id)
      if (todo) todo.entityStatus = action.payload.entityStatus
    }
  },
  extraReducers: builder => {
    builder
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach(tl => state.push({ ...tl, filter: 'all', entityStatus: 'idle' }))
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        const idx = state.findIndex(tl => tl.id === action.payload.id)
        if (idx > -1) state.splice(idx, 1)
      })
      .addCase(todolistsThunks.updateTodolist.fulfilled, (state, action) => {
        const todo = state.find((todo) => todo.id === action.payload.todolistId)
        if (todo) todo.title = action.payload.title
      })
  }
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = { fetchTodolists, addTodolist, removeTodolist, updateTodolist }

// legacy thunks
export const fetchTodolistsTC = () => (dispatch: AppThunkDispatchType) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }))
  todolistsApi.getTodolists()
    .then(res => {
      const resData: TodolistDomain[] = res.data.map(tl => ({ ...tl, filter: 'all', entityStatus: 'idle' }))
      // dispatch(todolistsActions.setTodolists({ todolists: resData }))
      dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      return resData
    })
    .then(todolists => {
      todolists.forEach(tl => dispatch(tasksThunks.fetchTasks(tl.id)))
    })
    .catch(err => handleServerNetworkError(err, dispatch))
}


import { todolistsApi } from 'features/TodolistsList/api/todolists.api'
import { RequestStatus } from 'app/app.slice'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { tasksThunks } from 'features/TodolistsList/model/tasks/tasks.slice'
import { createAppAsyncThunk } from 'common/utils'
import {
  TodolistDomain,
  TodolistFilterButton,
  TodolistOrigin,
  UpdateTodolistArgs
} from 'features/TodolistsList/model/todolists/todolist.types'
import { ResultCode } from 'common/enums'

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistDomain[] }, void>(
  'todolists/fetchTodolists',
  async (_, thunkAPI) => {
    const res = await todolistsApi.getTodolists()
    const resData: TodolistDomain[] = res.data.map(tl => ({ ...tl, filter: 'all', entityStatus: 'idle' }))

    resData.forEach(tl => thunkAPI.dispatch(tasksThunks.fetchTasks(tl.id)))
    return { todolists: resData }
  })
const addTodolist = createAppAsyncThunk<{ todolist: TodolistOrigin }, string>(
  'todolists/addTodolist',
  async (title: string, thunkAPI) => {
    const res = await todolistsApi.addTodolist(title)
    if (res.data.resultCode === ResultCode.Success) {
      return { todolist: res.data.data.item }
    } else {
      return thunkAPI.rejectWithValue({ data: res.data, showGlobalError: false })
    }
  })
const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
  'todolists/removeTodolist',
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: 'loading' }))
    const res = await todolistsApi.removeTodolist(todolistId)

    if (res.data.resultCode === ResultCode.Success) {
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: 'succeeded' }))
      return { id: todolistId }
    } else {
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: 'failed' }))
      return rejectWithValue({ data: res.data, showGlobalError: true })
    }
  })
const updateTodolist = createAppAsyncThunk<UpdateTodolistArgs, UpdateTodolistArgs>(
  'todolists/updateTodolist',
  async (param, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    dispatch(todolistsActions.changeTodolistEntityStatus({ id: param.todolistId, entityStatus: 'loading' }))
    const res = await todolistsApi.updateTodolist(param.todolistId, param.title)

    if (res.data.resultCode === ResultCode.Success) {
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: param.todolistId, entityStatus: 'succeeded' }))
      return param
    } else {
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: param.todolistId, entityStatus: 'failed' }))
      return rejectWithValue({ data: res.data, showGlobalError: true })
    }
  })

const slice = createSlice({
  name: 'todolists',
  initialState: [] as TodolistDomain[],
  reducers: {
    clearTodolists: () => {
      return []
    },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: TodolistFilterButton }>) => {
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

export const todolistsSlice = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = { fetchTodolists, addTodolist, removeTodolist, updateTodolist }
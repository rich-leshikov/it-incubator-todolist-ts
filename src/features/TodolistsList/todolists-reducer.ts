import { todolistAPI, TodolistType } from 'api/todolist-api'
import { appActions, RequestStatusType } from 'app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchTasksTC } from 'features/TodolistsList/tasks-reducer'
import { AppThunkDispatchType } from 'app/store'

const slice = createSlice({
  name: 'todolists',
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
      action.payload.todolists.forEach(tl => state.push({...tl, filter: 'all', entityStatus: 'idle' }))
    },
    clearTodolists: () => {
      return []
    },
    addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
    },
    removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
      const idx = state.findIndex(tl => tl.id === action.payload.id)
      if (idx > -1) state.splice(idx, 1)
    },
    changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id)
      if (todo) todo.title = action.payload.title
    },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id)
      if (todo) todo.filter = action.payload.filter
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id)
      if (todo) todo.entityStatus = action.payload.entityStatus
    }
  }
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions

// thunks
export const fetchTodolistsTC = () => (dispatch: AppThunkDispatchType) => { // dispatch: Dispatch - уточни про эту типизацию
  dispatch(appActions.setAppStatus({ status: 'loading' }))
  todolistAPI.getTodolists()
    .then(res => {
      const resData: TodolistDomainType[] = res.data.map(tl => ({ ...tl, filter: 'all', entityStatus: 'idle' }))
      dispatch(todolistsActions.setTodolists({ todolists: resData }))
      dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      return resData
    })
    .then(todolists => {
      todolists.forEach(tl => dispatch(fetchTasksTC(tl.id)))
    })
    .catch(err => handleServerNetworkError(err, dispatch))
}
export const addTodolistTC = (title: string) => (dispatch: AppThunkDispatchType) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }))
  todolistAPI.addTodolist(title)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }))
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(err => handleServerNetworkError(err, dispatch))
}
export const removeTodolistTC = (todolistId: string) => (dispatch: AppThunkDispatchType) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }))
  dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: 'loading' }))
  todolistAPI.removeTodolist(todolistId)
    .then(() => {
      dispatch(todolistsActions.removeTodolist({ id: todolistId }))
      dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: 'succeeded' }))
    })
    .catch(err => {
      handleServerNetworkError(err, dispatch)
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: 'failed' }))
    })
}
export const updateTodolistTC = (todolistId: string, title: string) => (dispatch: AppThunkDispatchType) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }))
  dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: 'loading' }))
  todolistAPI.updateTodolist(todolistId, title)
    .then(() => {
      dispatch(todolistsActions.changeTodolistTitle({ id: todolistId, title }))
      dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: 'succeeded' }))
    })
    .catch(err => {
      handleServerNetworkError(err, dispatch)
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: 'failed' }))
    })
}

export type FilterType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterType
  entityStatus: RequestStatusType
}

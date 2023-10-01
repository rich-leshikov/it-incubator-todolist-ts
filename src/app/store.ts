import { tasksReducer } from 'features/TodolistsList/tasks-reducer'
import { todolistsReducer } from 'features/TodolistsList/todolists-reducer'
import { AnyAction, combineReducers } from 'redux'
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { appReducer } from './app-reducer'
import { authReducer } from 'features/Login/auth-reducer'
import { configureStore } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  tasks: tasksReducer,
  todolists: todolistsReducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppThunkDispatchType = ThunkDispatch<AppRootStateType, unknown, AnyAction>

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
export const useAppDispatch = () => useDispatch<AppThunkDispatchType>()

// @ts-ignore
window.store = store

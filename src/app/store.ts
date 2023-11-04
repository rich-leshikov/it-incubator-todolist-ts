import { tasksSlice } from 'features/TodolistsList/model/tasks/tasks.slice'
import { todolistsSlice } from 'features/TodolistsList/model/todolists/todolists.slice'
import thunkMiddleware from 'redux-thunk'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { appSlice } from 'app/app.slice'
import { authSlice } from 'features/Login/auth.slice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    app: appSlice,
    auth: authSlice,
    tasks: tasksSlice,
    todolists: todolistsSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()

// @ts-ignore
window.store = store

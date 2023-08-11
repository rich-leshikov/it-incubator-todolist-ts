import { tasksReducer } from '../features/TodolistsList/tasks-reducer'
import { todolistsReducer } from '../features/TodolistsList/todolists-reducer'
import { AnyAction, applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk'
import { useDispatch } from 'react-redux'
import { appReducer } from './app-reducer'
import { authReducer } from '../features/Login/auth-reducer'

const rootReducer = combineReducers({
	app: appReducer,
	auth: authReducer,
	tasks: tasksReducer,
	todolists: todolistsReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppThunkDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>

export const useAppDispatch = () => useDispatch<AppThunkDispatchType>()

// @ts-ignore
window.store = store

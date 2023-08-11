import { todolistAPI, TodolistType } from '../../api/todolist-api'
import { Dispatch } from 'redux'
import { AppActionType, RequestStatusType, setAppStatusAC } from '../../app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils'

export const todolistsReducer = (
	state: Array<TodolistDomainType> = [],
	action: TodolistActionType
): Array<TodolistDomainType> => {
	switch (action.type) {
		case 'SET-TODOLISTS':
			return action.todolists
		case 'ADD-TODOLIST':
			return [{ ...action.todolist, filter: action.filter, entityStatus: action.entityStatus }, ...state]
		case 'REMOVE-TODOLIST':
			return state.filter(tl => tl.id !== action.id)
		case 'UPDATE-TODOLIST':
			return state.map(tl => (tl.id === action.id ? { ...tl, title: action.title } : tl))
		case 'CHANGE-TODOLIST-FILTER':
			return state.map(tl => (tl.id === action.id ? { ...tl, filter: action.filter } : tl))
		case 'CHANGE-TODOLIST-ENTITY-STATUS':
			return state.map(tl => (tl.id === action.id ? { ...tl, entityStatus: action.entityStatus } : tl))
		default:
			return state
	}
}

// actions
export const setTodolistsAC = (todolists: Array<TodolistDomainType>) => ({ type: 'SET-TODOLISTS', todolists }) as const
export const addTodolistAC = (todolist: TodolistType) =>
	({ type: 'ADD-TODOLIST', todolist, filter: 'all', entityStatus: 'idle' }) as const
export const removeTodolistAC = (id: string) => ({ type: 'REMOVE-TODOLIST', id }) as const
export const updateTodolistAC = (id: string, title: string) => ({ type: 'UPDATE-TODOLIST', id, title }) as const
export const changeTodolistFilterAC = (id: string, filter: FilterType) =>
	({ type: 'CHANGE-TODOLIST-FILTER', id, filter }) as const
export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) =>
	({ type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, entityStatus }) as const

// thunks
export const fetchTodolistsTC = () => (dispatch: Dispatch<TodolistActionType | AppActionType>) => {
	dispatch(setAppStatusAC('loading'))
	todolistAPI
		.getTodolists()
		.then(res => {
			const resData: TodolistDomainType[] = res.data.map(el => ({ ...el, filter: 'all', entityStatus: 'idle' }))
			dispatch(setTodolistsAC(resData))
			dispatch(setAppStatusAC('succeeded'))
		})
		.catch(err => handleServerNetworkError(err, dispatch))
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch<TodolistActionType | AppActionType>) => {
	dispatch(setAppStatusAC('loading'))
	todolistAPI
		.addTodolist(title)
		.then(res => {
			if (res.data.resultCode === 0) {
				dispatch(addTodolistAC(res.data.data.item))
				dispatch(setAppStatusAC('succeeded'))
			} else {
				handleServerAppError(res.data, dispatch)
			}
		})
		.catch(err => handleServerNetworkError(err, dispatch))
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<TodolistActionType | AppActionType>) => {
	dispatch(setAppStatusAC('loading'))
	dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
	todolistAPI
		.removeTodolist(todolistId)
		.then(() => {
			dispatch(removeTodolistAC(todolistId))
			dispatch(setAppStatusAC('succeeded'))
		})
		.catch(err => {
			handleServerNetworkError(err, dispatch)
			dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'))
		})
}
export const updateTodolistTC =
	(todolistId: string, title: string) => (dispatch: Dispatch<TodolistActionType | AppActionType>) => {
		dispatch(setAppStatusAC('loading'))
		dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
		todolistAPI
			.updateTodolist(todolistId, title)
			.then(() => {
				dispatch(updateTodolistAC(todolistId, title))
				dispatch(setAppStatusAC('succeeded'))
				dispatch(changeTodolistEntityStatusAC(todolistId, 'succeeded'))
			})
			.catch(err => {
				handleServerNetworkError(err, dispatch)
				dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'))
			})
	}

// types
export type TodolistActionType =
	| SetTodolistsActionType
	| AddTodolistActionType
	| RemoveTodolistActionType
	| UpdateTodolistActionType
	| ChangeTodolistFilterActionType
	| ChangeTodolistEntityStatusActionType
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type UpdateTodolistActionType = ReturnType<typeof updateTodolistAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>

export type FilterType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
	filter: FilterType
	entityStatus: RequestStatusType
}

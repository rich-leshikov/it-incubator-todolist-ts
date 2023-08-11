import { Dispatch } from 'redux'
import { authAPI } from '../api/todolist-api'
import { setIsLoggedInAC } from '../features/Login/auth-reducer'
import { handleServerAppError, handleServerNetworkError } from '../utils/error-utils'


const initialState: AppDomainType = {
	isInitialized: false,
	status: 'loading' as RequestStatusType,
	error: null
}

export const appReducer = (state: AppDomainType = initialState, action: AppActionType): AppDomainType => {
	switch (action.type) {
		case 'APP/SET-IS-INITIALIZED':
			return { ...state, isInitialized: action.isInitialized }
		case 'APP/SET-STATUS':
			return { ...state, status: action.status }
		case 'APP/SET-ERROR':
			return { ...state, error: action.error }
		default:
			return state
	}
}

// actions
export const setAppIsInitializedAC = (isInitialized: boolean) => ({
	type: 'APP/SET-IS-INITIALIZED', isInitialized
}) as const
export const setAppStatusAC = (status: RequestStatusType) => ({ type: 'APP/SET-STATUS', status }) as const
export const setAppErrorAC = (error: string | null) => ({ type: 'APP/SET-ERROR', error }) as const

// thunks
export const initializeAppTC = () => (dispatch: Dispatch) => {
	authAPI
		.me()
		.then(res => {
			if (res.data.resultCode === 0) {
				dispatch(setIsLoggedInAC(true))
			} else {
				handleServerAppError(res.data, dispatch)
			}
		})
		.catch(err => {
			handleServerNetworkError(err, dispatch)
		})
		.finally(() => {
			dispatch(setAppIsInitializedAC(true))
		})
}

// types
export type SetAppIsInitializedActionType = ReturnType<typeof setAppIsInitializedAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type AppActionType = SetAppIsInitializedActionType | SetAppStatusActionType | SetAppErrorActionType

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type AppDomainType = {
	isInitialized: boolean
	status: RequestStatusType
	error: string | null
}

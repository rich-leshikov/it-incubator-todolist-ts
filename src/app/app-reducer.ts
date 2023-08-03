import {Dispatch} from 'redux'
import { authAPI } from '../api/todolist-api'
import {setIsLoggedInAC} from '../features/Login/auth-reducer'


const initialState = {
  status: 'loading' as RequestStatusType,
  error: null
}

export const appReducer = (state: AppDomainType = initialState, action: AppActionType): AppDomainType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return {...state, status: action.status}
    case 'APP/SET-ERROR':
      return {...state, error: action.error}
    default:
      return state
  }
}

// actions
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)

// thunks
export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me().then(res => {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(true));
    } else {
    }
  })
}

// types
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type AppActionType =
  | SetAppStatusActionType
  | SetAppErrorActionType

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type AppDomainType = {
  status: RequestStatusType
  error: string | null
}

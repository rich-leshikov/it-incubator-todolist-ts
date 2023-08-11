import { Dispatch } from 'redux'
import { AppActionType, setAppStatusAC } from 'app/app-reducer'
import { authAPI, LoginParamsType } from 'api/todolist-api'
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils'

const initialState = {
  isLoggedIn: false
}

export const authReducer = (state: InitialStateType = initialState, action: AuthActionType): InitialStateType => {
  switch (action.type) {
    case 'login/SET-IS-LOGGED-IN':
      return { ...state, isLoggedIn: action.value }
    default:
      return state
  }
}

// actions
export const setIsLoggedInAC = (value: boolean) => ({ type: 'login/SET-IS-LOGGED-IN', value }) as const

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<AuthActionType>) => {
  dispatch(setAppStatusAC('loading'))
  authAPI
    .login(data)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true))
        dispatch(setAppStatusAC('succeeded'))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(err => handleServerNetworkError(err, dispatch))
}
export const logoutTC = () => (dispatch: Dispatch<AuthActionType>) => {
  dispatch(setAppStatusAC('loading'))
  authAPI
    .logout()
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false))
        dispatch(setAppStatusAC('succeeded'))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(err => handleServerNetworkError(err, dispatch))
}

// types
type InitialStateType = typeof initialState
type AuthActionType = ReturnType<typeof setIsLoggedInAC> | AppActionType

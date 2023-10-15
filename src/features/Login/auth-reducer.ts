import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { appActions } from 'app/app-reducer'
import { todolistsActions } from 'features/TodolistsList/model/todolists.reducer'
import { AppThunkDispatchType } from 'app/store'
import { handleServerAppError, handleServerNetworkError } from 'common/utils'
import { authAPI, LoginParams } from 'features/Login/auth.api'
import { ResultCode } from 'common/enums'

const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }
  }
})

export const authReducer = slice.reducer
export const authActions = slice.actions

// thunks
export const loginTC = (data: LoginParams) => (dispatch: AppThunkDispatchType) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }))
  authAPI
    .login(data)
    .then(res => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(err => handleServerNetworkError(err, dispatch))
}
export const logoutTC = () => (dispatch: AppThunkDispatchType) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }))
  authAPI
    .logout()
    .then(res => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
        dispatch(todolistsActions.clearTodolists())
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(err => handleServerNetworkError(err, dispatch))
}

export type AuthInitialStateType = ReturnType<typeof slice.getInitialState>

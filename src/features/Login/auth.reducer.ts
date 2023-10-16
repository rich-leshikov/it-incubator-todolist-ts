import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { appActions } from 'app/app-reducer'
import { todolistsActions } from 'features/TodolistsList/model/todolists.reducer'
import { AppThunkDispatchType } from 'app/store'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from 'common/utils'
import { authAPI, LoginParams } from 'features/Login/auth.api'
import { ResultCode } from 'common/enums'

const login = createAppAsyncThunk<void, LoginParams>('auth/login', async (param, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    const res = await authAPI.login(param)

    if (res.data.resultCode === ResultCode.Success) {
      dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      return
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch)
    return rejectWithValue(null)
  }
})
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

const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }
  },
  extraReducers: builder => {
    builder
      .addCase(authThunks.login.fulfilled, (state, action) => {
        state.isLoggedIn = true
      })
  }
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = { login }

export type AuthInitialStateType = ReturnType<typeof slice.getInitialState>

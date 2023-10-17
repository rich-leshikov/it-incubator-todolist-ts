import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { appActions } from 'app/app.reducer'
import { todolistsActions } from 'features/TodolistsList/model/todolists.reducer'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from 'common/utils'
import { authAPI, LoginParams } from 'features/Login/auth.api'
import { ResultCode } from 'common/enums'

const login = createAppAsyncThunk<void, LoginParams>(
  'auth/login',
  async (param, thunkAPI) => {
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
const logout = createAppAsyncThunk<void, undefined>(
  'auth/logout',
  async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  try {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    const res = await authAPI.logout()

    if (res.data.resultCode === ResultCode.Success) {
      dispatch(todolistsActions.clearTodolists())
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
const initializeApp = createAppAsyncThunk<void, undefined>(
  'app/initializeApp',
  async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  try {
    const res = await authAPI.me()

    if (res.data.resultCode === ResultCode.Success) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
      return
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch)
    return rejectWithValue(null)
  } finally {
    dispatch(appActions.setAppIsInitialized({ isInitialized: true }))
  }
})

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
      .addCase(authThunks.login.fulfilled, (state) => {
        state.isLoggedIn = true
      })
      .addCase(authThunks.logout.fulfilled, (state) => {
        state.isLoggedIn = false
      })
      .addCase(authThunks.initializeApp.fulfilled, (state) => {
        state.isLoggedIn = true
      })
  }
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = { login, logout, initializeApp }

export type AuthInitialStateType = ReturnType<typeof slice.getInitialState>
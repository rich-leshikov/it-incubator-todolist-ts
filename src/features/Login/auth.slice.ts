import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { appActions } from 'app/app.slice'
import { todolistsActions } from 'features/TodolistsList/model/todolists/todolists.slice'
import { createAppAsyncThunk } from 'common/utils'
import { authAPI, LoginParams } from 'features/Login/auth.api'
import { ResultCode } from 'common/enums'

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParams>(
  'auth/login',
  async (param, thunkAPI) => {
    const res = await authAPI.login(param)

    if (res.data.resultCode === ResultCode.Success) {
      return { isLoggedIn: true }
    } else {
      const isShowAppError = !res.data.fieldsErrors.length

      return thunkAPI.rejectWithValue({ data: res.data, showGlobalError: isShowAppError })
    }
  })
const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  'auth/logout',
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    const res = await authAPI.logout()

    if (res.data.resultCode === ResultCode.Success) {
      dispatch(todolistsActions.clearTodolists())
      return { isLoggedIn: false }
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true })
    }
  })
const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  'auth/initializeApp',
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    try {
      const res = await authAPI.me()
      if (res.data.resultCode === ResultCode.Success) {
        return { isLoggedIn: true }
      } else {
        return rejectWithValue({ data: res.data, showGlobalError: true })
      }
    } catch (err) {
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
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        isAnyOf(authThunks.login.fulfilled, authThunks.logout.fulfilled, authThunks.initializeApp.fulfilled),
        (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        })
  }
})

export const authSlice = slice.reducer
export const authThunks = { login, logout, initializeApp }

export type AuthInitialStateType = ReturnType<typeof slice.getInitialState>
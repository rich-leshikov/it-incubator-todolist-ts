import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authActions } from 'features/Login/auth.reducer'
import { AppThunkDispatchType } from 'app/store'
import { handleServerAppError, handleServerNetworkError } from 'common/utils'
import { authAPI } from 'features/Login/auth.api'
import { ResultCode } from 'common/enums'

const slice = createSlice({
  name: 'app',
  initialState: {
    isInitialized: false,
    status: 'loading' as RequestStatus,
    error: null as string | null
  },
  reducers: {
    setAppIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatus }>) => {
      state.status = action.payload.status
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    }
  }
})

export const appReducer = slice.reducer
export const appActions = slice.actions

// thunks
export const initializeAppTC = () => (dispatch: AppThunkDispatchType) => {
  authAPI.me()
    .then(res => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(err => {
      handleServerNetworkError(err, dispatch)
    })
    .finally(() => {
      dispatch(appActions.setAppIsInitialized({ isInitialized: true }))
    })
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialState = ReturnType<typeof slice.getInitialState>

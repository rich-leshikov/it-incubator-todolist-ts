import { Dispatch } from 'redux'
import { authAPI } from 'api/todolist-api'
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authActions } from 'features/Login/auth-reducer'

const slice = createSlice({
  name: 'app',
  initialState: {
    isInitialized: false,
    status: 'loading' as RequestStatusType,
    error: null as string | null
  },
  reducers: {
    setAppIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    }
  }
})

export const appReducer = slice.reducer
export const appActions = slice.actions
// export const { setIsLoggedIn } = slice.actions

// thunks
export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me()
    .then(res => {
      if (res.data.resultCode === 0) {
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

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialStateType = ReturnType<typeof slice.getInitialState>

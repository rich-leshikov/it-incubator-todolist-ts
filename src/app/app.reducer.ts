import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialState = ReturnType<typeof slice.getInitialState>

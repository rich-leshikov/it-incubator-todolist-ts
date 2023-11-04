import { AnyAction, createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit'

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
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher<AnyAction>(
        isPending, (state) => {
          state.status = 'loading'
        }
      )
      .addMatcher<AnyAction>(
        isRejected, (state, action) => {
          const { payload, error } = action

          state.status = 'failed'

          if (payload) {
            if (payload.showGlobalError) {
              state.error = payload.data.messages.length ? payload.data.messages[0] : 'Some error occurred'
            }
          } else {
            state.error = error.message ? error.message : 'Some error occurred'
          }
        }
      )
      .addMatcher<AnyAction>(
        isFulfilled, (state) => {
          state.status = 'succeeded'
        }
      )
  }
})

export const appSlice = slice.reducer
export const appActions = slice.actions

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialState = ReturnType<typeof slice.getInitialState>

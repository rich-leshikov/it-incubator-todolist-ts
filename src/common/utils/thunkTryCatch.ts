import { AppThunkDispatchType, AppRootStateType } from 'app/store'
import { handleServerNetworkError } from 'common/utils'
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { appActions } from 'app/app.reducer'

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppThunkDispatchType, null>,
  logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI

  dispatch(appActions.setAppStatus({ status: 'loading' }))

  try {
    return await logic()
  } catch (err) {
    handleServerNetworkError(err, dispatch)
    return rejectWithValue(null)
  } finally {
    dispatch(appActions.setAppStatus({ status: 'idle' }))
  }
}
import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppRootStateType, AppDispatch } from 'app/store'
import { BaseResponse } from 'common/api/common.api'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: AppDispatch
  rejectValue: null | RejectValue
}>()

export type RejectValue = {
  data: BaseResponse
  showGlobalError: boolean
}
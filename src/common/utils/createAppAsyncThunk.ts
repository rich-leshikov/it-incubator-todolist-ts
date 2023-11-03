import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppRootStateType, AppDispatch } from 'app/store'
import { BaseResponseType } from 'common/api/common.api'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: AppDispatch
  rejectValue: null | BaseResponseType
}>()
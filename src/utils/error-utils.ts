import { appActions } from 'app/app-reducer'
import { Dispatch } from 'redux'
import { ResponseType } from 'api/todolists-api'
import axios from 'axios'
import { AppThunkDispatchType } from 'app/store'

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }))
  } else {
    dispatch(appActions.setAppError({ error: 'Some error occurred' }))
  }
  dispatch(appActions.setAppStatus({ status: 'failed' }))
}

export const handleServerNetworkErrorOldVersion = (error: { message: string }, dispatch: Dispatch): void => {
  dispatch(appActions.setAppError({ error: error.message }))
  dispatch(appActions.setAppStatus({ status: 'failed' }))
}

export const handleServerNetworkError = (err: unknown, dispatch: AppThunkDispatchType): void => {
  let errorMessage = 'Some error occurred'

  if (axios.isAxiosError(err)) {
    // @ts-ignore
    errorMessage = err.response?.data?.message || err?.message || errorMessage
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`
  } else {
    errorMessage = JSON.stringify(err)
  }

  dispatch(appActions.setAppError({ error: errorMessage }))
  dispatch(appActions.setAppStatus({ status: 'failed' }))
}

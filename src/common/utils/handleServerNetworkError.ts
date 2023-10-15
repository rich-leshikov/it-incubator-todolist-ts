import { AppThunkDispatchType } from 'app/store'
import axios from 'axios'
import { appActions } from 'app/app-reducer'

export const handleServerNetworkError = (err: unknown, dispatch: AppThunkDispatchType): void => {
  let errorMessage = 'Some error occurred'

  if (axios.isAxiosError(err)) {
    errorMessage = err.message ? err.message : errorMessage
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`
  } else {
    errorMessage = JSON.stringify(err)
  }

  dispatch(appActions.setAppError({ error: errorMessage }))
  dispatch(appActions.setAppStatus({ status: 'failed' }))
}
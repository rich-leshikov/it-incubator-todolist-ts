import { appActions } from 'app/app.reducer'
import { Dispatch } from 'redux'
import { ResponseType } from 'common/api/common.api'

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }))
  } else {
    dispatch(appActions.setAppError({ error: 'Some error occurred' }))
  }
  dispatch(appActions.setAppStatus({ status: 'failed' }))
}


import { forwardRef, SyntheticEvent } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { useSelector } from 'react-redux'
import { AppRootStateType, useAppDispatch } from 'app/store'
import { setAppErrorAC } from 'app/app-reducer'

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export function ErrorSnackbar() {
  const error = useSelector<AppRootStateType, string | null>(state => state.app.error)
  const dispatch = useAppDispatch()

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    dispatch(setAppErrorAC(null))
  }

  return (
    <Snackbar open={!!error} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  )
}

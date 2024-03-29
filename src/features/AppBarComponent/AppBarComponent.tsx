import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material'
import { Menu } from '@mui/icons-material'
import { FC } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import { useAppDispatch, useAppSelector } from 'app/store'
import * as authSelectors from 'features/Login/auth.selectors'
import * as appSelectors from 'app/app.selectors'
import { authThunks } from 'features/Login/auth.slice'

export const AppBarComponent: FC = () => {
  const isLoggedIn = useAppSelector(authSelectors.isLoggedIn)
  const status = useAppSelector(appSelectors.status)
  const dispatch = useAppDispatch()

  const logOutHandler = () => dispatch(authThunks.logout())

  return (
    <AppBar position={'static'} color={'transparent'}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge={'start'} color={'inherit'} aria-label={'menu'}>
            <Menu />
          </IconButton>
          <Typography variant={'h6'}>Todolist</Typography>
        </div>
        {isLoggedIn && (
          <Button color={'inherit'} onClick={logOutHandler}>
            Log out
          </Button>
        )}
      </Toolbar>
      {status === 'loading' && <LinearProgress />}
    </AppBar>
  )
}

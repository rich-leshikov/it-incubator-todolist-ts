import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material'
import { Menu } from '@mui/icons-material'
import { FC } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'app/store'
import { logoutTC } from '../Login/auth-reducer'
import * as authSelectors from 'features/Login/auth-selectors'
import * as appSelectors from 'app/app-selectors'

type AppBarPropsType = {}

export const AppBarComponent: FC<AppBarPropsType> = () => {
  const isLoggedIn = useSelector(authSelectors.isLoggedIn)
  const status = useSelector(appSelectors.status)
  const dispatch = useAppDispatch()

  const logOutHandler = () => dispatch(logoutTC())

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

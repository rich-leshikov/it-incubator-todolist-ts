import {AppBar, Button, IconButton, Toolbar, Typography} from '@mui/material'
import {Menu} from '@mui/icons-material'
import {FC} from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import {useSelector} from 'react-redux'
import {AppRootStateType} from '../../app/store'
import {RequestStatusType} from '../../app/app-reducer'


type AppBarPropsType = {}


export const AppBarComponent: FC<AppBarPropsType> = () => {
  const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)

  return (
    <AppBar position={'static'} color={'transparent'}>
      <Toolbar style={{'display': 'flex', 'justifyContent': 'space-between'}}>
        <div style={{'display': 'flex', 'alignItems': 'center'}}>
          <IconButton edge={'start'} color={'inherit'} aria-label={'menu'}>
            <Menu/>
          </IconButton>
          <Typography variant={'h6'}>Todolist</Typography>
        </div>
        <Button color={'inherit'}>Login</Button>
      </Toolbar>
      {status === 'loading' && <LinearProgress/>}
    </AppBar>
  )
}
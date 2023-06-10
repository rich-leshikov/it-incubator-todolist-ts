import {AppBar, Button, IconButton, Toolbar, Typography} from '@mui/material';
import {Menu} from '@mui/icons-material';
import {FC} from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import {useSelector} from 'react-redux';
import {AppRootStateType} from '../../app/store';
import {RequestStatusType} from '../../api/app-reducer';


type AppBarPropsType = {}


export const AppBarComponent: FC<AppBarPropsType> = () => {
  const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)

  return (
    <AppBar position={'static'} color={'transparent'}>
      <Toolbar>
        <IconButton edge={'start'} color={'inherit'} aria-label={'menu'}>
          <Menu/>
        </IconButton>
        <Typography variant={'h6'}>Todolist</Typography>
        <Button color={'inherit'}>Login</Button>
      </Toolbar>
      {status === 'loading' && <LinearProgress/>}
    </AppBar>
  )
}
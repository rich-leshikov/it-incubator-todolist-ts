import {AppBar, Button, IconButton, Toolbar, Typography} from '@mui/material';
import {Menu} from '@mui/icons-material';
import {FC} from 'react';


type AppBarPropsType = {}


export const AppBarComponent: FC<AppBarPropsType> = () => {
  return (
    <div className={'appBar'}>
      <AppBar position={'static'} color={'transparent'}>
        <Toolbar>
          <IconButton edge={'start'} color={'inherit'} aria-label={'menu'}>
            <Menu/>
          </IconButton>
          <Typography variant={'h6'}>
            Todolist
          </Typography>
          <Button color={'inherit'}>Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}
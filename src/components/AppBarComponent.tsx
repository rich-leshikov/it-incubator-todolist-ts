import {AppBar, Button, IconButton, Toolbar, Typography} from '@mui/material';
import {Menu} from '@mui/icons-material';
import React from 'react';

type AppBarPropsType = {}

export function AppBarComponent(props: AppBarPropsType) {
  return (
    <div className={'appBar'}>
      <AppBar position={'static'}>
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
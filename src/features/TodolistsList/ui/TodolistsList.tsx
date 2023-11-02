import { Grid, Paper } from '@mui/material'
import styles from 'app/App.module.css'
import { Todolist } from 'features/TodolistsList/ui/Todolist/Todolist'
import { useAppDispatch, useAppSelector } from 'app/store'
import { todolistsThunks } from 'features/TodolistsList/model/todolists/todolists.reducer'
import { FC, useCallback, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import * as todolistsSelectors from 'features/TodolistsList/model/todolists/todolists.selectors'
import * as authSelectors from 'features/Login/auth.selectors'
import { AddInputElement } from 'common/components'

type TodolistsListProps = {}

export const TodolistsList: FC<TodolistsListProps> = () => {
  // console.log('render TodolistsList')

  const todolists = useAppSelector(todolistsSelectors.todolists)
  const isLoggedIn = useAppSelector(authSelectors.isLoggedIn)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isLoggedIn) return

    dispatch(todolistsThunks.fetchTodolists())
  }, [])

  const addTodolist = useCallback((todolistTitle: string) => {
    dispatch(todolistsThunks.addTodolist(todolistTitle))
  }, [])

  const todolistsList = todolists.map(tl => (
    <Grid key={tl.id} item>
      <Paper className={styles.todolist} style={{ padding: '10px' }}>
        <Todolist key={tl.id} todolist={tl} />
      </Paper>
    </Grid>
  ))

  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  }

  return (
    <>
      <Grid container style={{ margin: '20px 0' }}>
        <AddInputElement addElement={addTodolist} isDisabled={false} />
      </Grid>
      <Grid container spacing={3}>
        {todolistsList}
      </Grid>
    </>
  )
}

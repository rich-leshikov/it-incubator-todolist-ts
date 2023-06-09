import {Grid, Paper} from '@mui/material';
import styles from '../../app/App.module.css';
import {Todolist} from './Todolist/Todolist';
import {useSelector} from 'react-redux';
import {AppRootStateType, useAppDispatch} from '../../app/store';
import {
  addTodolistTC,
  fetchTodolistsTC,
  removeTodolistTC,
  TodolistDomainType,
  updateTodolistTC
} from './todolists-reducer';
import {FC, useCallback, useEffect} from 'react';
import {AddInputElement} from '../../components/AddInputElement/AddInputElement';


type TodolistsListPropsType = {}


export const TodolistsList: FC<TodolistsListPropsType> = () => {
  // console.log('render TodolistsList')

  const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTodolistsTC())
  }, [])

  const addTodolist = useCallback((todolistTitle: string) => {
    dispatch(addTodolistTC(todolistTitle))
  }, [])
  const deleteTodolist = useCallback((todolistId: string) => {
    dispatch(removeTodolistTC(todolistId))
  }, [])
  const updateTodolist = useCallback((title: string, todolistId: string) => {
    dispatch(updateTodolistTC(todolistId, title))
  }, [])

  const todolistsList = todolists.map(tl => <Grid key={tl.id} item>
      <Paper className={styles.todolist} style={{padding: '10px'}}>
        <Todolist
          key={tl.id}
          id={tl.id}
          title={tl.title}
          filter={tl.filter}
          deleteTodolist={deleteTodolist}
          updateTodolist={updateTodolist}
        />
      </Paper>
    </Grid>
  )

  return (
    <>
      <Grid container style={{margin: '20px 0'}}>
        <AddInputElement addElement={addTodolist}/>
      </Grid>
      <Grid container spacing={3}>
        {todolistsList}
      </Grid>
    </>
  )
}

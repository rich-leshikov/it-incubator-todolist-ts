import {useCallback, useEffect} from 'react';
import styles from './App.module.css';
import {Todolist} from './components/Todolist/Todolist';
import {AddInputElement} from './components/AddInputElement/AddInputElement';
import {AppBarComponent} from './components/AppBarComponent';
import {Container, Grid, Paper} from '@mui/material';
import {
  addTodolistTC,
  fetchTodolistsTC,
  removeTodolistTC,
  TodolistDomainType,
  updateTodolistTC
} from './state/todolists-reducer';
import {useSelector} from 'react-redux';
import {AppRootStateType, useAppDispatch} from './state/store';


export function App() {
  // console.log('render app')

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
    <div className="App">
      <AppBarComponent/>
      <Container fixed>
        <Grid container style={{margin: '20px 0'}}>
          <AddInputElement addElement={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>{todolistsList}</Grid>
      </Container>
    </div>
  )
}

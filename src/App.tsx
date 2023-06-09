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


function App() {
  console.log('render app')
  const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTodolistsTC())
  }, [])

  const addTodolist = useCallback((todolistTitle: string): void => {
    dispatch(addTodolistTC(todolistTitle))
  }, [])

  const deleteTodolist = useCallback((todolistId: string): void => {
    dispatch(removeTodolistTC(todolistId))
  }, [])

  const updateTodolist = useCallback((title: string, todolistId: string): void => {
    dispatch(updateTodolistTC(todolistId, title))
  }, [])



  return (
    <div className="App">
      <AppBarComponent/>
      <Container fixed>
        <Grid container style={{margin: '20px 0'}}>
          <AddInputElement addElement={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
          {
            todolists.map(tl => <Grid key={tl.id} item>
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
          }
        </Grid>
      </Container>
    </div>
  )
}

export default App

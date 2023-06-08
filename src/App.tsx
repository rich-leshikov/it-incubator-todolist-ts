import {useCallback, useEffect} from 'react';
import styles from './App.module.css';
import {Todolist} from './components/Todolist/Todolist';
import {AddInputElement} from './components/AddInputElement/AddInputElement';
import {AppBarComponent} from './components/AppBarComponent';
import {Container, Grid, Paper} from '@mui/material';
import {
  addTodolistTC,
  changeTodolistFilterAC,
  fetchTodolistsTC,
  FilterType,
  removeTodolistTC,
  TodolistDomainType,
  updateTodolistTC
} from './state/todolists-reducer';
import {addTaskTC, removeTaskTC, TasksStateType, updateTaskTC} from './state/tasks-reducer';
import {useSelector} from 'react-redux';
import {AppRootStateType, useAppDispatch} from './state/store';
import {TaskStatuses} from './api/todolist-api';


function App() {
  const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
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

  const filterTasks = useCallback((filterValue: FilterType, todolistId: string): void => {
    dispatch(changeTodolistFilterAC(todolistId, filterValue))
  }, [])

  const addTask = useCallback((taskTitle: string, todolistId: string): void => {
    dispatch(addTaskTC(taskTitle, todolistId))
  }, [])

  const removeTask = useCallback((taskId: string, todolistId: string): void => {
    dispatch(removeTaskTC(taskId, todolistId))
  }, [])

  const changeTaskStatus = useCallback((taskId: string, todolistId: string, status: TaskStatuses): void => {
    dispatch(updateTaskTC(taskId, todolistId, {status: status}))
  }, [])

  const changeTaskTitle = useCallback((title: string, todolistId: string, taskId: string): void => {
    dispatch(updateTaskTC(taskId, todolistId, {title: title}))
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
                    tasksList={tasks[tl.id]}
                    deleteTodolist={deleteTodolist}
                    addTask={addTask}
                    removeTask={removeTask}
                    checkTask={changeTaskStatus}
                    filterTasks={filterTasks}
                    updateTodolist={updateTodolist}
                    changeTaskTitle={changeTaskTitle}
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

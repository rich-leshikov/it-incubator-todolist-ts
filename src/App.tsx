import {useCallback, useEffect} from 'react';
import styles from './App.module.css';
import {Todolist} from './components/Todolist/Todolist';
import {AddInputElement} from './components/AddInputElement/AddInputElement';
import {AppBarComponent} from './components/AppBarComponent';
import {Container, Grid, Paper} from '@mui/material';
import {
  addTodolistAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  fetchTodolistsTC,
  FilterType,
  removeTodolistAC,
  TodolistDomainType
} from './state/todolists-reducer';
import {addTaskTC, changeTaskTitleAC, removeTaskTC, TasksStateType, updateTaskStatusTC} from './state/tasks-reducer';
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
    dispatch(addTodolistAC(todolistTitle))
  }, [dispatch])

  const deleteTodolist = useCallback((todolistId: string): void => {
    dispatch(removeTodolistAC(todolistId))
  }, [dispatch])

  const changeTodolistTitle = useCallback((title: string, todolistId: string): void => {
    dispatch(changeTodolistTitleAC(todolistId, title))
  }, [dispatch])

  const filterTasks = useCallback((filterValue: FilterType, todolistId: string): void => {
    dispatch(changeTodolistFilterAC(todolistId, filterValue))
  }, [dispatch])

  const addTask = useCallback((taskTitle: string, todolistId: string): void => {
    dispatch(addTaskTC(taskTitle, todolistId))
  }, [dispatch])

  const removeTask = useCallback((taskId: string, todolistId: string): void => {
    dispatch(removeTaskTC(taskId, todolistId))
  }, [dispatch])

  const changeTaskStatus = useCallback((taskId: string, todolistId: string, status: TaskStatuses): void => {
    dispatch(updateTaskStatusTC(taskId, todolistId, status))
  }, [dispatch])

  const changeTaskTitle = useCallback((title: string, todolistId: string, taskId: string): void => {
    dispatch(changeTaskTitleAC(taskId, title, todolistId))
  }, [dispatch])

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
                    changeTodolistTitle={changeTodolistTitle}
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

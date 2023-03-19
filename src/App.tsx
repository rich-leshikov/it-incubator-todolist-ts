import React, {useCallback} from 'react';
import styles from './App.module.css';
import {Todolist} from './components/Todolist/Todolist';
import {AddInputElement} from './components/AddInputElement/AddInputElement';
import {AppBarComponent} from './components/AppBarComponent';
import {Container, Grid, Paper} from '@mui/material';
import {
  addTodolistAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  FilterType,
  removeTodolistAC,
  TasksStateType,
  TodolistType
} from './state/todolists-reducer';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from './state/tasks-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

function App() {
  // console.log('App rendered')

  const todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const dispatch = useDispatch()

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
    dispatch(addTaskAC(taskTitle, todolistId))
  }, [dispatch])

  const removeTask = useCallback((taskId: string, todolistId: string): void => {
    dispatch(removeTaskAC(taskId, todolistId))
  }, [dispatch])

  const changeTaskStatus = useCallback((taskId: string, isDone: boolean, todolistId: string): void => {
    dispatch(changeTaskStatusAC(taskId, isDone, todolistId))
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

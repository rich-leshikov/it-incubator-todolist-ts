import React from 'react';
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
  const todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const dispatch = useDispatch()

  function addTodolist(todolistTitle: string): void {
    dispatch(addTodolistAC(todolistTitle))
  }

  function deleteTodolist(todolistId: string): void {
    dispatch(removeTodolistAC(todolistId))
  }

  function changeTodolistTitle(title: string, todolistId: string): void {
    dispatch(changeTodolistTitleAC(todolistId, title))
  }

  function filterTasks(filterValue: FilterType, todolistId: string): void {
    dispatch(changeTodolistFilterAC(todolistId, filterValue))
  }

  function addTask(taskTitle: string, todolistId: string): void {
    dispatch(addTaskAC(taskTitle, todolistId))
  }

  function removeTask(taskId: string, todolistId: string): void {
    dispatch(removeTaskAC(taskId, todolistId))
  }

  function changeTaskStatus(taskId: string, isDone: boolean, todolistId: string): void {
    dispatch(changeTaskStatusAC(taskId, isDone, todolistId))
  }

  function changeTaskTitle(title: string, todolistId: string, taskId: string): void {
    dispatch(changeTaskTitleAC(taskId, title, todolistId))
  }

  return (
    <div className="App">
      <AppBarComponent/>
      <Container fixed>
        <Grid container style={{margin: '20px 0'}}>
          <AddInputElement addElement={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
          {
            todolists.map(tl => {
              let filteredTasks = tasks[tl.id]

              if (tl.filter === 'active') {
                filteredTasks = filteredTasks.filter(t => !t.isDone)
              }
              if (tl.filter === 'completed') {
                filteredTasks = filteredTasks.filter(t => t.isDone)
              }
              return (
                <Grid item>
                  <Paper className={styles.todolist} style={{padding: '10px'}}>
                    <Todolist
                      key={tl.id}
                      id={tl.id}
                      title={tl.title}
                      filter={tl.filter}
                      list={filteredTasks}
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
            })
          }
        </Grid>
      </Container>
    </div>
  )
}

export default App

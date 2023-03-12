import React, {useState} from 'react';
import {v1} from 'uuid';
import styles from './App.module.css';
import {Todolist} from './components/Todolist/Todolist';
import {AddInputElement} from './components/AddInputElement/AddInputElement';
import {AppBarComponent} from './components/AppBarComponent';
import {Container, Grid, Paper} from '@mui/material';
import {FilterType, TasksStateType, TodolistType} from './state/todolists-reducer';

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

function App() {

  const todolistId1 = v1()
  const todolistId2 = v1()

  let [todolists, setTodolists] = useState<Array<TodolistType>>([
    {id: todolistId1, title: 'What to learn', filter: 'all'},
    {id: todolistId2, title: 'What to buy', filter: 'all'},
  ])
  let [taskLists, setTaskLists] = useState<TasksStateType>({
      [todolistId1]: [
        {id: v1(), title: 'HTML&CSS', isDone: true},
        {id: v1(), title: 'JS', isDone: true},
        {id: v1(), title: 'React', isDone: false},
        {id: v1(), title: 'Redux', isDone: false},
      ],
      [todolistId2]: [
        {id: v1(), title: 'bread', isDone: true},
        {id: v1(), title: 'milk', isDone: true},
        {id: v1(), title: 'book', isDone: false},
      ],
    }
  )

  function addTodolist(todolistTitle: string): void {
    let newTodolist: TodolistType = {id: v1(), title: todolistTitle, filter: 'all'}
    setTodolists([newTodolist, ...todolists])
    setTaskLists({[newTodolist.id]: [], ...taskLists})
  }

  function deleteTodolist(todolistId: string): void {
    const filteredTodolists = todolists.filter(tl => tl.id !== todolistId)
    setTodolists([...filteredTodolists])
    delete taskLists[todolistId]
    setTaskLists({...taskLists})
  }

  function changeTodolistTitle(title: string, todolistId: string): void {
    let changingTodolist: TodolistType | undefined = todolists.find(tl => tl.id === todolistId)
    if (changingTodolist) {
      changingTodolist.title = title
      setTodolists([...todolists])
    }
  }

  function filterTasks(filterValue: FilterType, todolistId: string): void {
    let todolist: TodolistType | undefined = todolists.find(tl => tl.id === todolistId)
    if (todolist) {
      todolist.filter = filterValue
      setTodolists([...todolists])
    }
  }

  function addTask(taskTitle: string, todolistId: string): void {
    let newTask: TaskType = {id: v1(), title: taskTitle, isDone: false}
    taskLists[todolistId] = [newTask, ...taskLists[todolistId]]
    setTaskLists({...taskLists})
  }

  function removeTask(taskId: string, todolistId: string): void {
    taskLists[todolistId] = taskLists[todolistId].filter(t => t.id !== taskId)
    setTaskLists({...taskLists})
  }

  function changeTaskStatus(taskId: string, isDone: boolean, todolistId: string): void {
    let task: TaskType | undefined = taskLists[todolistId].find(t => t.id === taskId)
    if (task) {
      task.isDone = isDone
    }
    setTaskLists({...taskLists})
  }

  function changeTaskTitle(title: string, todolistId: string, taskId: string): void {
    let changingTask: TaskType | undefined = taskLists[todolistId].find(t => t.id === taskId)
    if (changingTask) {
      changingTask.title = title
      setTaskLists({...taskLists})
    }
  }

  return (
    <div className="App">
      <AppBarComponent/>
      <Container fixed>
        <Grid container style={{padding: '20px'}}>
          <AddInputElement addElement={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
          {
            todolists.map(tl => {
              let filteredTasks = taskLists[tl.id]

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

export default App;

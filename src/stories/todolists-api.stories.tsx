import {useEffect, useState} from 'react';
import {TaskType, todolistAPI, TodolistType} from '../api/todolist-api';


export default {
  title: 'API'
}


export const GetTodolists = () => {
  const [state, setState] = useState<TodolistType[]>([])

  useEffect(() => {
    todolistAPI.getTodolists()
      .then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state.map(t => `${t.id}: ${t.title}`))}</div>
}

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    todolistAPI.createTodolist('What to learn')
      .then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    let todolistId = '753bd591-4359-407e-aeb5-e205bd4b1cba'

    todolistAPI.deleteTodolist(todolistId)
      .then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    let todolistId = 'c7ec2c84-40a3-4b83-9e20-201a162022c5'
    let title = 'What to do'

    todolistAPI.updateTodolist(todolistId, title)
      .then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
  const [state, setState] = useState<TaskType[]>([])

  useEffect(() => {
    let todolistId = '6ee902d6-24ca-4bbd-aee2-88fe6e31af55'

    todolistAPI.getTasks(todolistId)
      .then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const CreateTask = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    let todolistId = '6ee902d6-24ca-4bbd-aee2-88fe6e31af55'
    let taskTitle = 'English'

    todolistAPI.createTask(todolistId, taskTitle)
      .then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    let todolistId = 'c7ec2c84-40a3-4b83-9e20-201a162022c5'
    let taskId = 'c7ec2c84-40a3-4b83-9e20-201a162022c5'

    todolistAPI.deleteTask(todolistId, taskId)
      .then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const UpdateTaskTitle = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    let todolistId = 'c7ec2c84-40a3-4b83-9e20-201a162022c5'
    let taskId = 'c7ec2c84-40a3-4b83-9e20-201a162022c5'
    let title = 'smth new'

    todolistAPI.updateTask(todolistId, taskId,title)
      .then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

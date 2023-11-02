import { useEffect, useState } from 'react'
import { todolistsApi } from 'features/TodolistsList/api/todolists.api'
import { TaskOrigin, UpdateTaskModelType } from 'features/TodolistsList/model/tasks/task.types'
import { TodolistOrigin } from 'features/TodolistsList/model/todolists/todolist.types.reducer'
import { tasksApi } from 'features/TodolistsList/api/tasks.api'

export default {
  title: 'API'
}

export const GetTodolists = () => {
  const [state, setState] = useState<TodolistOrigin[]>([])

  useEffect(() => {
    todolistsApi.getTodolists().then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state.map(t => `${t.id}: ${t.title}`))}</div>
}

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    todolistsApi.addTodolist('What to learn').then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    let todolistId = 'dc418e23-7064-44ed-84fd-00743cca8f99'

    todolistsApi.removeTodolist(todolistId).then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    let todolistId = 'c7ec2c84-40a3-4b83-9e20-201a162022c5'
    let title = 'What to do'

    todolistsApi.updateTodolist(todolistId, title).then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
  const [state, setState] = useState<TaskOrigin[]>([])

  useEffect(() => {
    let todolistId = '6ee902d6-24ca-4bbd-aee2-88fe6e31af55'

    tasksApi.getTasks(todolistId).then(response => setState(response.data.items))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const CreateTask = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    let todolistId = '6ee902d6-24ca-4bbd-aee2-88fe6e31af55'
    let taskTitle = 'English'

    tasksApi.addTask({ todolistId, taskTitle }).then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    let todolistId = 'c7ec2c84-40a3-4b83-9e20-201a162022c5'
    let taskId = 'c7ec2c84-40a3-4b83-9e20-201a162022c5'

    tasksApi.removeTask({ taskId, todolistId }).then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const UpdateTaskTitle = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    let todolistId = 'c7ec2c84-40a3-4b83-9e20-201a162022c5'
    let taskId = 'c7ec2c84-40a3-4b83-9e20-201a162022c5'
    let taskModel: UpdateTaskModelType = {
      title: 'new title',
      description: '',
      status: 0,
      priority: 1,
      startDate: '',
      deadline: ''
    }

    tasksApi.updateTask(todolistId, taskId, taskModel).then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

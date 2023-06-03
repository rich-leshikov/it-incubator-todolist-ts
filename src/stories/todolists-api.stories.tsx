import {useEffect, useState} from 'react';
import {instance, todolistAPI} from '../api/todolist-api';


export default {
  title: 'API'
}


export const GetTodolists = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    todolistAPI.getTodolists()
      .then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    todolistAPI.createTodolist('What to create')
      .then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    let todolistId = '20dc6bf1-b248-4e23-a99f-cbb505844d67'

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

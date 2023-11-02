import React, { FC } from 'react'
import { Button } from '@mui/material'
import { useAppDispatch } from 'app/store'
import { Filter, TodolistDomain } from 'features/TodolistsList/model/todolists/todolist.types.reducer'
import { todolistsActions } from 'features/TodolistsList/model/todolists/todolists.reducer'

type FilterTasksButtonsProps = {
  todolist: TodolistDomain
}

export const FilterTasksButtons: FC<FilterTasksButtonsProps> = ({todolist}) => {
  const dispatch = useAppDispatch()

  const filterTasksHandler = (filterValue: Filter) => {
    dispatch(todolistsActions.changeTodolistFilter({ id: todolist.id, filter: filterValue }))
  }

  return (
    <>
      <Button
        onClick={() => filterTasksHandler('all')}
        color={'inherit'}
        size={'small'}
        variant={todolist.filter === 'all' ? 'contained' : 'outlined'}
      >All</Button>
      <Button
        onClick={() => filterTasksHandler('active')}
        color={'error'}
        size={'small'}
        variant={todolist.filter === 'active' ? 'contained' : 'outlined'}
      >Active</Button>
      <Button
        onClick={() => filterTasksHandler('completed')}
        color={'success'}
        size={'small'}
        variant={todolist.filter === 'completed' ? 'contained' : 'outlined'}
      >Completed</Button>
    </>
  )
}

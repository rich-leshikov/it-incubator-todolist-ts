import React, { FC } from 'react'
import { EditableTitle } from 'common/components'
import { IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { TodolistDomain } from 'features/TodolistsList/model/todolists/todolist.types.reducer'
import { useAppDispatch } from 'app/store'
import { todolistsThunks } from 'features/TodolistsList/model/todolists/todolists.reducer'

type TodolistTitleProps = {
  todolist: TodolistDomain
}

export const TodolistTitle: FC<TodolistTitleProps> = ({ todolist }) => {
  const dispatch = useAppDispatch()

  const removeTodolistHandler = () => {
    dispatch(todolistsThunks.removeTodolist(todolist.id))
  }
  const changeTodolistTitleHandler = (title: string) => {
    dispatch(todolistsThunks.updateTodolist({ todolistId: todolist.id, title }))
  }

  return (
    <>
      <h2>
        <EditableTitle
          title={todolist.title}
          changeTitle={changeTodolistTitleHandler}
          isDisabled={todolist.entityStatus === 'loading'}
        />
        <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === 'loading'}>
          <Delete style={{ color: '#ccc0c0' }} />
        </IconButton>
      </h2>
    </>
  )
}
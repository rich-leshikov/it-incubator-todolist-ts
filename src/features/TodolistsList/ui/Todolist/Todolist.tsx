import { FC, memo, useCallback } from 'react'
import { IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { todolistsThunks } from 'features/TodolistsList/model/todolists/todolists.reducer'
import styles from 'features/TodolistsList/ui/Todolist/Todolist.module.css'
import { useAppDispatch } from 'app/store'
import { tasksThunks } from 'features/TodolistsList/model/tasks/tasks.reducer'
import { AddInputElement, EditableTitle } from 'common/components'
import { TodolistDomain } from 'features/TodolistsList/model/todolists/todolist.types.reducer'
import { FilterTasksButtons } from 'features/TodolistsList/ui/Todolist/FilterTasksButtons'
import { Tasks } from 'features/TodolistsList/ui/Todolist/Tasks'

type TodolistProps = {
  todolist: TodolistDomain
}

export const Todolist: FC<TodolistProps> = memo(({ todolist }) => {
  // console.log('render todolist')

  const dispatch = useAppDispatch()

  const removeTodolistHandler = () => {
    dispatch(todolistsThunks.removeTodolist(todolist.id))
  }
  const changeTodolistTitleHandler = (title: string) => {
    dispatch(todolistsThunks.updateTodolist({ todolistId: todolist.id, title }))
  }
  const addTaskHandler = useCallback((taskTitle: string) => {
    dispatch(tasksThunks.addTask({ taskTitle, todolistId: todolist.id }))
  }, [todolist.id])

  let tasksList = tasks

  if (todolist.filter === 'active') {
    tasksList = tasksList.filter(t => t.status === TaskStatuses.New)
  }
  if (todolist.filter === 'completed') {
    tasksList = tasksList.filter(t => t.status === TaskStatuses.Completed)
  }

  let finalTasksList = tasksList.map(t => (
    <Task key={t.id} task={t} />
  ))

  return (
    <div className={'todolist'}>
      <div className='todolist__title'>
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
      </div>
      <div className={styles.buttons}>
        <FilterTasksButtons todolist={todolist} />
      </div>
      <div>{finalTasksList}</div>
      <AddInputElement addElement={addTaskHandler} isDisabled={todolist.entityStatus === 'loading'} />
    </div>
  )
})

import { FC, memo, useCallback } from 'react'
import { Button, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { todolistsActions, todolistsThunks } from 'features/TodolistsList/model/todolists/todolists.reducer'
import styles from 'features/TodolistsList/ui/Todolist/Todolist.module.css'
import { useAppDispatch, useAppSelector } from 'app/store'
import { tasksThunks } from 'features/TodolistsList/model/tasks/tasks.reducer'
import { Task } from 'features/TodolistsList/ui/Todolist/Task/Task'
import * as tasksSelectors from 'features/TodolistsList/model/tasks/tasks.selectors'
import { AddInputElement, EditableTitle } from 'common/components'
import { TaskStatuses } from 'common/enums'
import { Filter, TodolistDomain } from 'features/TodolistsList/model/todolists/todolist.types.reducer'

type TodolistProps = {
  todolist: TodolistDomain
}

export const Todolist: FC<TodolistProps> = memo(({ todolist }) => {
  // console.log('render todolist')

  const tasks = useAppSelector(tasksSelectors.tasks(todolist.id))
  const dispatch = useAppDispatch()

  const removeTodolistHandler = () => {
    dispatch(todolistsThunks.removeTodolist(todolist.id))
  }
  const changeTodolistTitleHandler = (title: string) => {
    dispatch(todolistsThunks.updateTodolist({ todolistId: todolist.id, title }))
  }
  const filterTasksHandler = (filterValue: Filter) => {
    dispatch(todolistsActions.changeTodolistFilter({ id: todolist.id, filter: filterValue }))
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
        <Button
          className={styles.button}
          onClick={() => filterTasksHandler('all')}
          color={'inherit'}
          size={'small'}
          variant={todolist.filter === 'all' ? 'contained' : 'outlined'}
        >All</Button>
        <Button
          className={styles.button}
          onClick={() => filterTasksHandler('active')}
          color={'error'}
          size={'small'}
          variant={todolist.filter === 'active' ? 'contained' : 'outlined'}
        >Active</Button>
        <Button
          className={styles.button}
          onClick={() => filterTasksHandler('completed')}
          color={'success'}
          size={'small'}
          variant={todolist.filter === 'completed' ? 'contained' : 'outlined'}
        >Completed</Button>
      </div>
      <div>{finalTasksList}</div>
      <AddInputElement addElement={addTaskHandler} isDisabled={todolist.entityStatus === 'loading'} />
    </div>
  )
})

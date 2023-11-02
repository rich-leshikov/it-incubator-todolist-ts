import { memo, useCallback } from 'react'
import { Button, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { todolistsActions } from 'features/TodolistsList/model/todolists/todolists.reducer'
import styles from 'features/TodolistsList/ui/Todolist/Todolist.module.css'
import { useAppDispatch, useAppSelector } from 'app/store'
import { tasksThunks } from 'features/TodolistsList/model/tasks/tasks.reducer'
import { Task } from 'features/TodolistsList/ui/Todolist/Task/Task'
import { RequestStatus } from 'app/app.reducer'
import * as tasksSelectors from 'features/TodolistsList/model/tasks/tasks.selectors'
import { AddInputElement, EditableTitle } from 'common/components'
import { TaskStatuses } from 'common/enums'
import { Filter } from 'features/TodolistsList/model/todolists/todolist.types.reducer'

type TodolistPropsType = {
  id: string
  title: string
  filter: Filter
  entityStatus: RequestStatus
  deleteTodolist: (id: string) => void
  updateTodolist: (title: string, todolistId: string) => void
}

export const Todolist = memo((props: TodolistPropsType) => {
  // console.log('render todolist')

  const tasks = useAppSelector(tasksSelectors.tasks(props.id))
  const dispatch = useAppDispatch()

  const onDeleteTodolist = () => {
    props.deleteTodolist(props.id)
  }
  const onChangeTitleTodolist = useCallback(
    (title: string) => {
      props.updateTodolist(title, props.id)
    },
    [props.updateTodolist, props.id]
  )
  const filterTasks = (filterValue: Filter) => {
    dispatch(todolistsActions.changeTodolistFilter({ id: props.id, filter: filterValue }))
  }
  const createTask = useCallback(
    (taskTitle: string) => {
      dispatch(tasksThunks.addTask({ taskTitle, todolistId: props.id }))
    },
    [props.id]
  )

  let tasksList = tasks

  if (props.filter === 'active') {
    tasksList = tasksList.filter(t => t.status === TaskStatuses.New)
  }
  if (props.filter === 'completed') {
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
            title={props.title}
            changeTitle={onChangeTitleTodolist}
            isDisabled={props.entityStatus === 'loading'}
          />
          <IconButton onClick={onDeleteTodolist} disabled={props.entityStatus === 'loading'}>
            <Delete style={{ color: '#ccc0c0' }} />
          </IconButton>
        </h2>
      </div>
      <div className={styles.buttons}>
        <Button
          className={styles.button}
          onClick={() => filterTasks('all')}
          color={'inherit'}
          size={'small'}
          variant={props.filter === 'all' ? 'contained' : 'outlined'}
        >
          All
        </Button>
        <Button
          className={styles.button}
          onClick={() => filterTasks('active')}
          color={'error'}
          size={'small'}
          variant={props.filter === 'active' ? 'contained' : 'outlined'}
        >
          Active
        </Button>
        <Button
          className={styles.button}
          onClick={() => filterTasks('completed')}
          color={'success'}
          size={'small'}
          variant={props.filter === 'completed' ? 'contained' : 'outlined'}
        >
          Completed
        </Button>
      </div>
      <div>{finalTasksList}</div>
      <AddInputElement addElement={createTask} isDisabled={props.entityStatus === 'loading'} />
    </div>
  )
})

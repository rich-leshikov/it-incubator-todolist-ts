import { memo, useCallback } from 'react'
import { AddInputElement } from 'components/AddInputElement/AddInputElement'
import { EditableTitle } from 'components/EditableTitle/EditableTitle'
import { Button, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { Filter, todolistsActions } from 'features/TodolistsList/todolists-reducer'
import styles from 'features/TodolistsList/Todolist/Todolist.module.css'
import { TaskStatuses } from 'api/todolists-api'
import { useAppDispatch, useAppSelector } from 'app/store'
import { addTask, removeTaskTC, updateTask } from 'features/TodolistsList/tasks-reducer'
import { Task } from 'features/TodolistsList/Todolist/Task/Task'
import { RequestStatus } from 'app/app-reducer'
import * as tasksSelectors from 'features/TodolistsList/tasks-selectors'

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
      dispatch(addTask({taskTitle, todolistId: props.id}))
    },
    [props.id]
  )
  const removeTask = useCallback(
    (taskId: string) => {
      dispatch(removeTaskTC(taskId, props.id))
    },
    [props.id]
  )
  const changeTaskStatus = useCallback(
    (taskId: string, status: TaskStatuses) => {
      dispatch(updateTask(taskId, props.id, { status: status }))
    },
    [props.id]
  )
  const changeTaskTitle = useCallback(
    (taskId: string, title: string) => {
      dispatch(updateTask(taskId, props.id, { title: title }))
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
    <Task key={t.id} task={t} removeTask={removeTask} checkTask={changeTaskStatus} changeTaskTitle={changeTaskTitle} />
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

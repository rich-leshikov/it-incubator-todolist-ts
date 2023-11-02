import { ChangeEvent, memo, useCallback } from 'react'
import { Checkbox, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import styles from 'features/TodolistsList/ui/Todolist/Task/Task.module.css'
import { EditableTitle } from 'common/components'
import { TaskStatuses } from 'common/enums'
import { TaskDomain } from 'features/TodolistsList/model/tasks/task.types'

type TaskPropsType = {
  task: TaskDomain
  removeTask: (id: string) => void
  checkTask: (id: string, status: TaskStatuses) => void
  changeTaskTitle: (title: string, taskId: string) => void
}

export const Task = memo((props: TaskPropsType) => {
  // console.log('render task')

  const removeTask = () => {
    props.removeTask(props.task.id)
  }
  const checkTask = (e: ChangeEvent<HTMLInputElement>) => {
    props.checkTask(props.task.id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New)
  }
  const changeTaskTitle = useCallback(
    (title: string) => {
      props.changeTaskTitle(props.task.id, title)
    },
    [props.changeTaskTitle, props.task]
  )

  return (
    <div className={`${styles.task} ${props.task.status === TaskStatuses.Completed && 'isCompleted'}`}>
      <div className={styles.content}>
        <Checkbox
          color={'success'}
          checked={props.task.status === TaskStatuses.Completed}
          onChange={checkTask}
          disabled={props.task.entityStatus === 'loading'}
        />
        <EditableTitle
          title={props.task.title}
          changeTitle={changeTaskTitle}
          isDisabled={props.task.entityStatus === 'loading'}
        />
      </div>
      <IconButton onClick={removeTask} disabled={props.task.entityStatus === 'loading'}>
        <Delete style={{ color: '#ccc0c0' }} />
      </IconButton>
    </div>
  )
})

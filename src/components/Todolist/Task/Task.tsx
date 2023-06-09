import React, {ChangeEvent} from 'react'
import {EditableTitle} from '../EditableTitle'
import {Checkbox, IconButton} from '@mui/material'
import {Delete} from '@mui/icons-material'
import styles from './Task.module.css'
import {TaskStatuses, TaskType} from '../../../api/todolist-api'


type TaskPropsType = {
  task: TaskType
  removeTask: (id: string) => void
  checkTask: (id: string, status: TaskStatuses) => void
  changeTaskTitle: (title: string, taskId: string) => void
}


export const Task = React.memo((props: TaskPropsType) => {
  console.log('render task')
  const removeTask = (): void => {
    props.removeTask(props.task.id)
  }
  const checkTask = (e: ChangeEvent<HTMLInputElement>): void => {
    props.checkTask(props.task.id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New)
  }
  const changeTaskTitle = (title: string): void => {
    props.changeTaskTitle(title, props.task.id)
  }

  return (
    <div className={`${styles.task} ${props.task.status === TaskStatuses.Completed && 'isCompleted'}`}>
      <div className={styles.content}>
        <Checkbox
          color={'success'}
          checked={props.task.status === TaskStatuses.Completed}
          onChange={checkTask}
        />
        <EditableTitle
          title={props.task.title}
          changeTitle={changeTaskTitle}
        />
      </div>
      <IconButton onClick={removeTask}><Delete style={{color: '#ccc0c0'}}/></IconButton>
    </div>
  )
})
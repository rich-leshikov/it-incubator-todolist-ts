import React, {ChangeEvent} from 'react'
import {EditableTitle} from '../EditableTitle'
import {Checkbox, IconButton} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {FilterType} from '../../../state/todolists-reducer'
import styles from './Task.module.css'
import {TaskStatuses} from '../../../api/todolist-api';


type TaskPropsType = {
  id: string
  todolistID: string
  taskTitle: string
  status: TaskStatuses
  filterTasks: (value: FilterType, todolistId: string) => void
  removeTask: (id: string, todolistId: string) => void
  checkTask: (id: string, todolistId: string, status: TaskStatuses) => void
  changeTaskTitle: (title: string, todolistId: string, taskId: string) => void
}

export const Task = React.memo((props: TaskPropsType) => {
  const removeTask = (): void => {
    props.removeTask(props.id, props.todolistID)
  }
  const checkTask = (e: ChangeEvent<HTMLInputElement>): void => {
    props.checkTask(props.id, props.todolistID, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New)
  }
  const changeTaskTitle = (title: string): void => {
    props.changeTaskTitle(title, props.todolistID, props.id)
  }

  return (
    <div className={`${styles.task} ${props.status === TaskStatuses.Completed && 'isCompleted'}`}>
      <div className={styles.content}>
        <Checkbox
          color={'success'}
          checked={props.status === TaskStatuses.Completed}
          onChange={checkTask}
        />
        <EditableTitle
          title={props.taskTitle}
          changeTitle={changeTaskTitle}
        />
      </div>
      <IconButton onClick={removeTask}><Delete style={{color: '#ccc0c0'}}/></IconButton>
    </div>
  )
})
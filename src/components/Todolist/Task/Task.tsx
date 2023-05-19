import React, {ChangeEvent, useCallback} from 'react'
import {EditableTitle} from '../EditableTitle'
import {Checkbox, IconButton} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {FilterType} from '../../../state/todolists-reducer'
import styles from './Task.module.css'


type TaskPropsType = {
  id: string
  todolistID: string
  taskTitle: string
  isDone: boolean
  filterTasks: (value: FilterType, todolistId: string) => void
  removeTask: (id: string, todolistId: string) => void
  checkTask: (id: string, isDone: boolean, todolistId: string) => void
  changeTaskTitle: (title: string, todolistId: string, taskId: string) => void
}

export const Task = React.memo((props: TaskPropsType) => {
  // console.log('Task rendered')

  const removeTask = useCallback((): void => {
    props.removeTask(props.id, props.todolistID)
  }, [props.removeTask, props.id, props.todolistID])

  const checkTask = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    props.checkTask(props.id, e.currentTarget.checked, props.todolistID)
  }, [props.checkTask, props.id, props.todolistID])

  const changeTaskTitle = useCallback((title: string): void => {
    props.changeTaskTitle(title, props.todolistID, props.id)
  }, [props.changeTaskTitle, props.todolistID, props.id])

  return (
    <div className={styles.task}>
      <div className={styles.content}>
        <Checkbox
          color={'success'}
          checked={props.isDone}
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
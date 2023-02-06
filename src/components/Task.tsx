import React, {ChangeEvent} from 'react';
import {FilterType} from '../App';
import {TitleElement} from './TitleElement';
import {Checkbox, IconButton} from '@mui/material';
import { Delete } from '@mui/icons-material';

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

export function Task(props: TaskPropsType) {

  const removeTask = (): void => props.removeTask(props.id, props.todolistID)
  const checkTask = (e: ChangeEvent<HTMLInputElement>): void => {
    props.checkTask(props.id, e.currentTarget.checked, props.todolistID)
  }
  const changeTaskTitle = (title: string): void => props.changeTaskTitle(title, props.todolistID, props.id)

  return (
    <div className={props.isDone ? 'fade' : ''}>
      <Checkbox
        color={'success'}
        checked={props.isDone}
        onChange={checkTask}
      />
      <TitleElement
        title={props.taskTitle}
        changeTitle={changeTaskTitle}
      />
      <IconButton onClick={removeTask}><Delete style={{color: '#ccc0c0'}}/></IconButton>
    </div>
  )
}
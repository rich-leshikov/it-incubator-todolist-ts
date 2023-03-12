import React from 'react';
import {TaskType} from '../../App';
import {AddInputElement} from '../AddInputElement/AddInputElement';
import {TitleElement} from './Task/TitleElement';
import {Task} from './Task/Task';
import {Button, IconButton} from '@mui/material';
import {Delete} from '@mui/icons-material';
import {FilterType} from '../../state/todolists-reducer';
import styles from './Todolist.module.css'

type TodolistPropsType = {
  id: string
  title: string
  filter: FilterType
  list: Array<TaskType>
  deleteTodolist: (id: string) => void
  changeTodolistTitle: (title: string, todolistId: string) => void
  addTask: (taskTitle: string, todolistId: string) => void
  filterTasks: (value: FilterType, todolistId: string) => void
  removeTask: (id: string, todolistId: string) => void
  checkTask: (id: string, isDone: boolean, todolistId: string) => void
  changeTaskTitle: (title: string, todolistId: string, taskId: string) => void
}

export function Todolist(props: TodolistPropsType) {
  const addTask = (title: string): void => props.addTask(title, props.id)
  const onDeleteTodolist = (): void => props.deleteTodolist(props.id)
  const onPressFilter = (filter: FilterType): void => props.filterTasks(filter, props.id)
  const onChangeTitleHandler = (title: string): void => props.changeTodolistTitle(title, props.id)

  return (
    <div className={'todolist'}>
      <div className="todolist__title">
        <h2><TitleElement title={props.title} changeTitle={onChangeTitleHandler}/>
          <IconButton onClick={onDeleteTodolist}><Delete style={{color: '#ccc0c0'}}/></IconButton>
        </h2>
      </div>
      <div className={styles.buttons}>
        <Button
          className={styles.button}
          onClick={() => onPressFilter('all')}
          color={'inherit'}
          size={'small'}
          variant={props.filter === 'all' ? 'contained' : 'outlined'}
        >All</Button>
        <Button
          className={styles.button}
          onClick={() => onPressFilter('active')}
          color={'error'}
          size={'small'}
          variant={props.filter === 'active' ? 'contained' : 'outlined'}
        >Active</Button>
        <Button
          className={styles.button}
          onClick={() => onPressFilter('completed')}
          color={'success'}
          size={'small'}
          variant={props.filter === 'completed' ? 'contained' : 'outlined'}
        >Completed</Button>
      </div>
      <div>
        {props.list.map(t => {
          return (
            <Task
              id={t.id} todolistID={props.id} taskTitle={t.title}
              isDone={t.isDone} filterTasks={props.filterTasks} removeTask={props.removeTask}
              checkTask={props.checkTask} changeTaskTitle={props.changeTaskTitle}
            />
          )
        })}
      </div>
      <AddInputElement addElement={addTask}/>
    </div>
  );
}


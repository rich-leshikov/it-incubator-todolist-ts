import React from 'react';
import {TaskType} from '../App';
import {AddInputElement} from './AddInputElement';
import {TitleElement} from './TitleElement';
import {Task} from './Task';
import {Button, IconButton} from '@mui/material';
import {Delete} from '@mui/icons-material';
import {FilterType} from '../state/todolists-reducer';

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
      <AddInputElement addElement={addTask}/>
      <div>
        {props.list.map(t => {
          return (
            <Task
              id={t.id} todolistID={props.id} taskTitle={t.taskTitle}
              isDone={t.isDone} filterTasks={props.filterTasks} removeTask={props.removeTask}
              checkTask={props.checkTask} changeTaskTitle={props.changeTaskTitle}
            />
          )
        })}
      </div>
      <div className="buttons">
        <Button
          // className={props.filter === 'all' ? 'activeFilter' : ''}
          onClick={() => onPressFilter('all')}
          color={'inherit'}
          variant={props.filter === 'all' ? 'contained' : 'outlined'}
        >All
        </Button>
        <Button
          // className={props.filter === 'active' ? 'activeFilter' : ''}
          onClick={() => onPressFilter('active')}
          color={'error'}
          variant={props.filter === 'active' ? 'contained' : 'outlined'}
        >Active
        </Button>
        <Button
          // className={props.filter === 'completed' ? 'activeFilter' : ''}
          onClick={() => onPressFilter('completed')}
          color={'success'}
          variant={props.filter === 'completed' ? 'contained' : 'outlined'}
        >Completed
        </Button>
      </div>
    </div>
  );
}


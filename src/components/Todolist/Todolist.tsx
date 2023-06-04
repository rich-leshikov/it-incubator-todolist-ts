import React, {useCallback} from 'react';
import {AddInputElement} from '../AddInputElement/AddInputElement';
import {EditableTitle} from './EditableTitle';
import {Task} from './Task/Task';
import {Button, IconButton} from '@mui/material';
import {Delete} from '@mui/icons-material';
import {FilterType} from '../../state/todolists-reducer';
import styles from './Todolist.module.css'
import {TaskStatuses, TaskType} from '../../api/todolist-api';


type TodolistPropsType = {
  id: string
  title: string
  filter: FilterType
  tasksList: Array<TaskType>
  deleteTodolist: (id: string) => void
  changeTodolistTitle: (title: string, todolistId: string) => void
  addTask: (taskTitle: string, todolistId: string) => void
  filterTasks: (value: FilterType, todolistId: string) => void
  removeTask: (id: string, todolistId: string) => void
  checkTask: (id: string, status: TaskStatuses, todolistId: string) => void
  changeTaskTitle: (title: string, todolistId: string, taskId: string) => void
}


export const Todolist = React.memo((props: TodolistPropsType) => {
  const addTask = useCallback((title: string): void => {
    props.addTask(title, props.id)
  }, [props.addTask, props.id])

  const onDeleteTodolist = useCallback((): void => {
    props.deleteTodolist(props.id)
  }, [props.deleteTodolist, props.id])

  const onPressFilter = useCallback((filter: FilterType): void => {
      props.filterTasks(filter, props.id)
    }, [props.filterTasks, props.id])

  const onChangeTitleHandler = useCallback((title: string): void => {
      props.changeTodolistTitle(title, props.id)
    }, [props.changeTodolistTitle, props.id])

  let tasksList = props.tasksList

  if (props.filter === 'active') {
    tasksList = tasksList.filter(t => t.status === TaskStatuses.New)
  }
  if (props.filter === 'completed') {
    tasksList = tasksList.filter(t => t.status === TaskStatuses.Completed)
  }

  return (
    <div className={'todolist'}>
      <div className="todolist__title">
        <h2><EditableTitle title={props.title} changeTitle={onChangeTitleHandler}/>
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
        {tasksList.map(t => <Task
            key={t.id} id={t.id} todolistID={props.id} taskTitle={t.title}
            status={t.status} filterTasks={props.filterTasks} removeTask={props.removeTask}
            checkTask={props.checkTask} changeTaskTitle={props.changeTaskTitle}
          />
        )}
      </div>
      <AddInputElement addElement={addTask}/>
    </div>
  );
})


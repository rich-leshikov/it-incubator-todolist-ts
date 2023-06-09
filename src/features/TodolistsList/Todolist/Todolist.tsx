import {memo, useCallback, useState} from 'react';
import {AddInputElement} from '../../../components/AddInputElement/AddInputElement';
import {EditableTitle} from '../../../components/EditableTitle/EditableTitle';
import {Button, IconButton} from '@mui/material';
import {Delete} from '@mui/icons-material';
import {changeTodolistFilterAC, FilterType} from '../todolists-reducer';
import styles from './Todolist.module.css'
import {TaskStatuses, TaskType} from '../../../api/todolist-api';
import {AppRootStateType, useAppDispatch} from '../../../app/store';
import {addTaskTC, fetchTasksTC, removeTaskTC, updateTaskTC} from '../tasks-reducer';
import {useSelector} from 'react-redux';
import {Task} from './Task/Task';


type TodolistPropsType = {
  id: string
  title: string
  filter: FilterType
  deleteTodolist: (id: string) => void
  updateTodolist: (title: string, todolistId: string) => void
}


export const Todolist = memo((props: TodolistPropsType) => {
  // console.log('render todolist')

  const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[props.id])
  const dispatch = useAppDispatch()

  useState(() => {
    dispatch(fetchTasksTC(props.id))
  })

  const onDeleteTodolist = () => {
    props.deleteTodolist(props.id)
  }
  const onChangeTitleTodolist = useCallback((title: string) => {
    props.updateTodolist(title, props.id)
  }, [props.updateTodolist, props.id])
  const filterTasks = (filterValue: FilterType) => {
    dispatch(changeTodolistFilterAC(props.id, filterValue))
  }
  const addTask = useCallback((taskTitle: string) => {
    dispatch(addTaskTC(taskTitle, props.id))
  }, [props.id])
  const removeTask = useCallback((taskId: string) => {
    dispatch(removeTaskTC(taskId, props.id))
  }, [props.id])
  const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses) => {
    dispatch(updateTaskTC(taskId, props.id, {status: status}))
  }, [props.id])
  const changeTaskTitle = useCallback((taskId: string, title: string) => {
    dispatch(updateTaskTC(taskId, props.id, {title: title}))
  }, [props.id])


  let tasksList = tasks

  if (props.filter === 'active') {
    tasksList = tasksList.filter(t => t.status === TaskStatuses.New)
  }
  if (props.filter === 'completed') {
    tasksList = tasksList.filter(t => t.status === TaskStatuses.Completed)
  }

  let finalTasksList = tasksList.map(t => <Task
      key={t.id}
      task={t}
      removeTask={removeTask}
      checkTask={changeTaskStatus}
      changeTaskTitle={changeTaskTitle}
    />
  )

  return (
    <div className={'todolist'}>
      <div className="todolist__title">
        <h2><EditableTitle title={props.title} changeTitle={onChangeTitleTodolist}/>
          <IconButton onClick={onDeleteTodolist}><Delete style={{color: '#ccc0c0'}}/></IconButton>
        </h2>
      </div>
      <div className={styles.buttons}>
        <Button
          className={styles.button}
          onClick={() => filterTasks('all')}
          color={'inherit'}
          size={'small'}
          variant={props.filter === 'all' ? 'contained' : 'outlined'}
        >All</Button>
        <Button
          className={styles.button}
          onClick={() => filterTasks('active')}
          color={'error'}
          size={'small'}
          variant={props.filter === 'active' ? 'contained' : 'outlined'}
        >Active</Button>
        <Button
          className={styles.button}
          onClick={() => filterTasks('completed')}
          color={'success'}
          size={'small'}
          variant={props.filter === 'completed' ? 'contained' : 'outlined'}
        >Completed</Button>
      </div>
      <div>
        {finalTasksList}
      </div>
      <AddInputElement addElement={addTask}/>
    </div>
  )
})

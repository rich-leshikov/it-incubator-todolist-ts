import React, {ChangeEvent} from 'react';
import {FilterType} from '../App';
import {AddInputElement} from './AddInputElement';
import {TitleElement} from './TitleElement';

export type TaskType = {
  id: string,
  taskTitle: string,
  isDone: boolean
}

type TodolistPropsType = {
  id: string,
  title: string,
  filter: FilterType,
  list: Array<TaskType>,
  deleteTodolist: (id: string) => void,
  addTask: (taskTitle: string, todolistId: string) => void,
  filterTasks: (value: FilterType, todolistId: string) => void,
  removeTask: (id: string, todolistId: string) => void,
  checkTask: (id: string, isDone: boolean, todolistId: string) => void,
  changeTodolistTitle: (title: string, todolistId: string) => void,
  changeTaskTitle: (title: string, todolistId: string, taskId: string) => void,
}

export function Todolist(props: TodolistPropsType) {

  const addTask = (title: string) => props.addTask(title, props.id)
  const onDeleteTodolist = () => props.deleteTodolist(props.id)
  const onPressFilter = (filter: FilterType) => props.filterTasks(filter, props.id)
  const onChangeTitleHandler = (title: string) => props.changeTodolistTitle(title, props.id)

  return (
    <div className={'todolist'}>
      <div className="todolist__title">
        <h2><TitleElement title={props.title} changeTitle={onChangeTitleHandler}/>
          <button onClick={onDeleteTodolist}>x</button>
        </h2>
      </div>
      <AddInputElement addElement={addTask}/>
      <ul>
        {props.list.map(t => {
          const removeTask = () => props.removeTask(t.id, props.id)
          const checkTask = (e: ChangeEvent<HTMLInputElement>) => props.checkTask(t.id, e.currentTarget.checked, props.id)
          const changeTaskTitle = (title: string) => props.changeTaskTitle(title, props.id, t.id)

          return (
            <li className={t.isDone ? 'fade' : ''}>
              <input
                type={'checkbox'}
                checked={t.isDone}
                onChange={checkTask}
              />
              <TitleElement
                title={t.taskTitle}
                changeTitle={changeTaskTitle}
              />
              <button onClick={removeTask}>x</button>
            </li>
          )
        })}
      </ul>
      <div className="buttons">
        <button
          className={props.filter === 'all' ? 'activeFilter' : ''}
          onClick={() => onPressFilter('all')}
        >All
        </button>
        <button
          className={props.filter === 'active' ? 'activeFilter' : ''}
          onClick={() => onPressFilter('active')}
        >Active
        </button>
        <button
          className={props.filter === 'completed' ? 'activeFilter' : ''}
          onClick={() => onPressFilter('completed')}
        >Completed
        </button>
      </div>
    </div>
  );
}


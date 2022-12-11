import React, {ChangeEvent} from 'react';
import {FilterType} from '../App';
import {AddInputElement} from './AddInputElement';

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
}

export function Todolist(props: TodolistPropsType) {

  function addTask(title: string) {
    props.addTask(title, props.id)
  }

  function onDeleteTodolist() {
    props.deleteTodolist(props.id)
  }

  function onPressFilter(filter: FilterType) {
    props.filterTasks(filter, props.id)
  }

  return (
    <div className={'todolist'}>
      <div className="todolist__title">
        <h2>{props.title}
          <button onClick={onDeleteTodolist}>x</button>
        </h2>
      </div>
      <AddInputElement addElement={addTask}/>
      <ul>
        {props.list.map(t => {
          const removeTask = () => props.removeTask(t.id, props.id)

          const checkTask = (e: ChangeEvent<HTMLInputElement>) => props.checkTask(t.id, e.currentTarget.checked, props.id)

          return (
            <li className={t.isDone ? 'fade' : ''}>
              <input
                type={'checkbox'}
                checked={t.isDone}
                onChange={checkTask}
              />
              <span>{t.taskTitle}</span>
              <button onClick={removeTask}>x</button>
            </li>
          )
        })}
      </ul>
      <div className="buttons">
        <button className={props.filter === 'all' ? 'activeFilter' : ''} onClick={() => onPressFilter('all')}>All
        </button>
        <button className={props.filter === 'active' ? 'activeFilter' : ''}
                onClick={() => onPressFilter('active')}>Active
        </button>
        <button className={props.filter === 'completed' ? 'activeFilter' : ''}
                onClick={() => onPressFilter('completed')}>Completed
        </button>
      </div>
    </div>
  );
}
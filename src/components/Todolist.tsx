import React from 'react';
import {FilterType, TaskType} from '../App';
import {AddInputElement} from './AddInputElement';
import {TitleElement} from './TitleElement';
import {Task} from './Task';

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
          <button onClick={onDeleteTodolist}>x</button>
        </h2>
      </div>
      <AddInputElement addElement={addTask}/>
      <ul>
        {props.list.map(t => {
          return (
            <Task
              id={t.id} todolistID={props.id} taskTitle={t.taskTitle}
              isDone={t.isDone} filterTasks={props.filterTasks} removeTask={props.removeTask}
              checkTask={props.checkTask} changeTaskTitle={props.changeTaskTitle}
            />
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


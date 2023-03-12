import {AddTodolistActionType, RemoveTodolistActionType, TasksStateType, todolistId1, todolistId2} from './todolists-reducer';
import {v1} from 'uuid';
import {TaskType} from '../App';

export type TaskActionType =
  AddTaskActionType |
  RemoveTaskActionType |
  ChangeTaskStatusActionType |
  ChangeTaskTitleActionType |
  AddTodolistActionType |
  RemoveTodolistActionType
export type AddTaskActionType = {
  type: 'ADD-TASK'
  title: string
  todolistID: string
}
export type RemoveTaskActionType = {
  type: 'REMOVE-TASK'
  taskID: string
  todolistID: string
}
export type ChangeTaskStatusActionType = {
  type: 'CHANGE-TASK-STATUS'
  taskID: string
  isDone: boolean
  todolistID: string
}
export type ChangeTaskTitleActionType = {
  type: 'CHANGE-TASK-TITLE'
  taskID: string
  title: string
  todolistID: string
}

const initialState: TasksStateType = {
  [todolistId1]: [
    {id: v1(), title: 'HTML&CSS', isDone: true},
    {id: v1(), title: 'JS', isDone: true},
    {id: v1(), title: 'React', isDone: false},
    {id: v1(), title: 'Redux', isDone: false},
  ],
  [todolistId2]: [
    {id: v1(), title: 'bread', isDone: true},
    {id: v1(), title: 'milk', isDone: true},
    {id: v1(), title: 'book', isDone: false},
  ],
}

export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionType): TasksStateType => {
  switch (action.type) {
    case 'ADD-TASK':
      const newTask: TaskType = {id: v1(), title: action.title, isDone: false}
      return {...state, [action.todolistID]: [newTask, ...state[action.todolistID]]}
    case 'REMOVE-TASK':
      return {...state, [action.todolistID]: state[action.todolistID].filter(t => t.id !== action.taskID)}
    case 'CHANGE-TASK-STATUS':
      return {
        ...state, [action.todolistID]: state[action.todolistID].map(t => t.id === action.taskID ?
          {...t, isDone: action.isDone} : t)
      }
    case 'CHANGE-TASK-TITLE':
      return {
        ...state, [action.todolistID]: state[action.todolistID].map(t => t.id === action.taskID ?
          {...t, title: action.title} : t)
      }
    case 'ADD-TODOLIST':
      return {[action.id]: [], ...state}
    case 'REMOVE-TODOLIST':
      const stateCopy = {...state}
      delete stateCopy[action.id]
      return stateCopy
    default:
      return state
  }
}

export const addTaskAC = (taskTitle: string, todolistID: string): AddTaskActionType => {
  return {
    type: 'ADD-TASK',
    title: taskTitle,
    todolistID: todolistID
  }
}
export const removeTaskAC = (taskID: string, todolistID: string): RemoveTaskActionType => {
  return {
    type: 'REMOVE-TASK',
    taskID: taskID,
    todolistID: todolistID
  }
}
export const changeTaskStatusAC = (taskID: string, isDone: boolean, todolistID: string): ChangeTaskStatusActionType => {
  return {
    type: 'CHANGE-TASK-STATUS',
    taskID: taskID,
    isDone: isDone,
    todolistID: todolistID
  }
}
export const changeTaskTitleAC = (taskID: string, taskTitle: string, todolistID: string): ChangeTaskTitleActionType => {
  return {
    type: 'CHANGE-TASK-TITLE',
    taskID: taskID,
    title: taskTitle,
    todolistID: todolistID
  }
}
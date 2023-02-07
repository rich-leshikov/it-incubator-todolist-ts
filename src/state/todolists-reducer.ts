import {TaskType} from '../App';
import {v1} from 'uuid';

export type FilterType = 'all' | 'active' | 'completed'
export type TodolistType = {
  id: string
  title: string
  filter: FilterType
}
export type TodolistTaskType = {
  [key: string]: Array<TaskType>
}
export type ActionType =
  AddTodolistActionType |
  RemoveTodolistActionType |
  ChangeTodolistTitleActionType |
  ChangeTodolistFilterActionType
export type AddTodolistActionType = {
  type: 'ADD-TODOLIST'
  title: string
}
export type RemoveTodolistActionType = {
  type: 'REMOVE-TODOLIST'
  id: string
}
export type ChangeTodolistTitleActionType = {
  type: 'CHANGE-TODOLIST-TITLE'
  id: string
  title: string
}
export type ChangeTodolistFilterActionType = {
  type: 'CHANGE-TODOLIST-FILTER'
  id: string
  filter: FilterType
}

export const todolistsReducer = (state: Array<TodolistType>, action: ActionType) => {
  switch (action.type) {
    case 'ADD-TODOLIST':
      return [{id: v1(), title: action.title, filter: 'all'}, ...state]
    case 'REMOVE-TODOLIST':
      return [...state.filter(tl => tl.id !== action.id)]
    case 'CHANGE-TODOLIST-TITLE':
      let changingTodolist: TodolistType | undefined = state.find(tl => tl.id === action.id)
      if (changingTodolist) {
        changingTodolist.title = action.title
        return [...state]
      }
      return state
    case 'CHANGE-TODOLIST-FILTER':
      let todolist: TodolistType | undefined = state.find(tl => tl.id === action.id)
      if (todolist) {
        todolist.filter = action.filter
        return [...state]
      }
      return state
    default:
      throw new Error('I don\'t understand this type')
  }
}

export const AddTodolistAC = (todolistTitle: string): AddTodolistActionType => {
  return {
    type: 'ADD-TODOLIST',
    title: todolistTitle
  }
}
export const RemoveTodolistAC = (todolistID: string): RemoveTodolistActionType => {
  return {
    type: 'REMOVE-TODOLIST',
    id: todolistID
  }
}
export const ChangeTodolistTitleAC = (todolistID: string, todolistTitle: string): ChangeTodolistTitleActionType => {
  return {
    type: 'CHANGE-TODOLIST-TITLE',
    id: todolistID,
    title: todolistTitle
  }
}
export const ChangeTodolistFilterAC = (todolistID: string, todolistFilter: FilterType): ChangeTodolistFilterActionType => {
  return {
    type: 'CHANGE-TODOLIST-FILTER',
    id: todolistID,
    filter: todolistFilter
  }
}

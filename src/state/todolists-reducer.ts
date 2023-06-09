import {todolistAPI, TodolistType} from '../api/todolist-api';
import {Dispatch} from 'redux';


export type FilterType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterType
}

export type TodolistActionType =
  AddTodolistActionType |
  RemoveTodolistActionType |
  UpdateTodolistActionType |
  ChangeTodolistFilterActionType |
  SetTodolistsActionType
export type AddTodolistActionType = {
  type: 'ADD-TODOLIST'
  todolist: TodolistType
  filter: FilterType
}
export type RemoveTodolistActionType = {
  type: 'REMOVE-TODOLIST'
  id: string
}
export type UpdateTodolistActionType = {
  type: 'UPDATE-TODOLIST'
  id: string
  title: string
}
export type ChangeTodolistFilterActionType = {
  type: 'CHANGE-TODOLIST-FILTER'
  id: string
  filter: FilterType
}
export type SetTodolistsActionType = {
  type: 'SET-TODOLISTS'
  todolists: Array<TodolistType>
}


const initialState: TodolistDomainType[] = []


export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistActionType): Array<TodolistDomainType> => {
  switch (action.type) {
    case 'SET-TODOLISTS':
      return action.todolists.map(tl => ({...tl, filter: 'all'}))
    case 'ADD-TODOLIST':
      return [{...action.todolist, filter: action.filter}, ...state]
    case 'REMOVE-TODOLIST':
      return state.filter(tl => tl.id !== action.id)
    case 'UPDATE-TODOLIST':
      return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
    case 'CHANGE-TODOLIST-FILTER':
      return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
    default:
      return state
  }
}

export const setTodolistsAC = (todolists: Array<TodolistType>): SetTodolistsActionType => {
  return {type: 'SET-TODOLISTS', todolists}
}
export const addTodolistAC = (todolist: TodolistType): AddTodolistActionType => {
  return {type: 'ADD-TODOLIST', todolist, filter: 'all'}
}
export const removeTodolistAC = (id: string): RemoveTodolistActionType => {
  return {type: 'REMOVE-TODOLIST', id}
}
export const updateTodolistAC = (id: string, title: string): UpdateTodolistActionType => {
  return {type: 'UPDATE-TODOLIST', id, title}
}
export const changeTodolistFilterAC = (todolistID: string, todolistFilter: FilterType): ChangeTodolistFilterActionType => {
  return {
    type: 'CHANGE-TODOLIST-FILTER',
    id: todolistID,
    filter: todolistFilter
  }
}

export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
  todolistAPI.getTodolists()
    .then(res => dispatch(setTodolistsAC(res.data)))
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  todolistAPI.addTodolist(title)
    .then(res => dispatch(addTodolistAC(res.data.data.item)))
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
  todolistAPI.removeTodolist(todolistId)
    .then(() => dispatch(removeTodolistAC(todolistId)))
}
export const updateTodolistTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  todolistAPI.updateTodolist(todolistId, title)
    .then(() => dispatch(updateTodolistAC(todolistId, title)))
}

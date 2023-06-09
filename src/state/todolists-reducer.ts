import {todolistAPI, TodolistType} from '../api/todolist-api';
import {Dispatch} from 'redux';


export const todolistsReducer = (state: Array<TodolistDomainType> = [], action: TodolistActionType): Array<TodolistDomainType> => {
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

// actions
export const setTodolistsAC = (todolists: Array<TodolistType>) =>
  ({type: 'SET-TODOLISTS', todolists} as const)
export const addTodolistAC = (todolist: TodolistType) =>
  ({type: 'ADD-TODOLIST', todolist, filter: 'all'} as const)
export const removeTodolistAC = (id: string) =>
  ({type: 'REMOVE-TODOLIST', id} as const)
export const updateTodolistAC = (id: string, title: string) =>
  ({type: 'UPDATE-TODOLIST', id, title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterType) =>
  ({type: 'CHANGE-TODOLIST-FILTER', id, filter} as const)

// thunks
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

// types
export type TodolistActionType =
  | SetTodolistsActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | UpdateTodolistActionType
  | ChangeTodolistFilterActionType
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type UpdateTodolistActionType = ReturnType<typeof updateTodolistAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>

export type FilterType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterType
}

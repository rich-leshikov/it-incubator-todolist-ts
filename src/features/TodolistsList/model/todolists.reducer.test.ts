import {
  todolistsReducer,
  TodolistDomain,
  todolistsActions,
  Filter,
  todolistsThunks
} from 'features/TodolistsList/model/todolists.reducer'
import { v1 } from 'uuid'
import { todolists } from 'features/TodolistsList/model/todolists.selectors'

let todolistId1: string
let todolistId2: string
let todolistId3: string
let startState: Array<TodolistDomain>

beforeEach(() => {
  todolistId1 = v1()
  todolistId2 = v1()
  todolistId3 = v1()

  startState = [
    {
      id: todolistId1,
      title: 'What to learn',
      addedDate: '',
      order: 0,
      filter: 'all',
      entityStatus: 'idle'
    },
    {
      id: todolistId2,
      title: 'What to buy',
      addedDate: '',
      order: 0,
      filter: 'all',
      entityStatus: 'idle'
    }
  ]
})

test('todolist should be removed', () => {
  const endState = todolistsReducer(startState, todolistsActions.removeTodolist({ id: todolistId1 }))

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test('todolist should be added', () => {
  const newTodolistTitle = 'New Todolist'
  const action = {
    type: todolistsThunks.addTodolist.fulfilled.type,
    payload: {
      todolist: {
        id: todolistId3,
        title: newTodolistTitle,
        addedDate: '',
        order: 0
      }
    }
  }


  const endState = todolistsReducer(startState, action)

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(newTodolistTitle)
})

test('todolist should change its name', () => {
  const newTodolistTitle = 'New Todolist'
  const action = todolistsActions.changeTodolistTitle({ id: todolistId2, title: newTodolistTitle })

  const endState = todolistsReducer(startState, action)

  expect(endState.length).toBe(2)
  expect(endState[0].title).toBe('What to learn')
  expect(endState[1].title).toBe(newTodolistTitle)
})

test('filter of todolist should be changed', () => {
  const newFilter: Filter = 'completed'
  const action = todolistsActions.changeTodolistFilter({ id: todolistId2, filter: newFilter })

  const endState = todolistsReducer(startState, action)

  expect(endState[0].filter).toBe('all')
  expect(endState[1].filter).toBe(newFilter)
})

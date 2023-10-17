import React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, combineReducers, legacy_createStore } from 'redux'
import { AppRootStateType } from './store'
import { tasksReducer } from 'features/TodolistsList/model/tasks.reducer'
import { todolistsReducer } from 'features/TodolistsList/model/todolists.reducer'
import { TaskPriorities, TaskStatuses } from 'common/enums'
import { appReducer } from 'app/app.reducer'
import thunkMiddleware from 'redux-thunk'

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer
})

const initialGlobalState = {
  app: {
    isInitialized: false,
    status: 'idle',
    error: null
  },
  auth: {
    isLoggedIn: false
  },
  todolists: [
    {
      id: 'todolistId1',
      title: 'What to learn',
      addedDate: '',
      order: 0,
      filter: 'all',
      entityStatus: 'idle'
    },
    {
      id: 'todolistId2',
      title: 'What to buy',
      addedDate: '',
      order: 0,
      filter: 'all',
      entityStatus: 'idle'
    }
  ],
  tasks: {
    ['todolistId1']: [
      {
        id: '1',
        title: 'CSS',
        status: TaskStatuses.New,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle'
      },
      {
        id: '2',
        title: 'JS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle'
      },
      {
        id: '3',
        title: 'React',
        status: TaskStatuses.New,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle'
      }
    ],
    ['todolistId2']: [
      {
        id: '1',
        title: 'bread',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle'
      },
      {
        id: '2',
        title: 'milk',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle'
      },
      {
        id: '3',
        title: 'tea',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle'
      }
    ]
  }
}

export const storyBookStore = legacy_createStore(
  rootReducer,
  initialGlobalState as AppRootStateType,
  applyMiddleware(thunkMiddleware)
)

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>
}

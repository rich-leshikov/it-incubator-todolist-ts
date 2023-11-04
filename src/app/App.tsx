import { AppBarComponent } from 'features/AppBarComponent/AppBarComponent'
import { CircularProgress, Container } from '@mui/material'
import { TodolistsList } from 'features/TodolistsList/ui/TodolistsList'
import { useAppDispatch, useAppSelector } from './store'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Login } from 'features/Login/Login'
import { useEffect } from 'react'
import * as appSelectors from 'app/app.selectors'
import { ErrorSnackbar } from 'common/components'
import { authThunks } from 'features/Login/auth.slice'

export function App() {
  // console.log('render App')

  const isInitialized = useAppSelector(appSelectors.isInitialized)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(authThunks.initializeApp())
  }, [])

  if (!isInitialized) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '30%',
          textAlign: 'center',
          width: '100%'
        }}
      >
        <CircularProgress />
      </div>
    )
  }

  return (
    <HashRouter>
      <div className='App'>
        <ErrorSnackbar />
        <AppBarComponent />
        <Container fixed>
          <Routes>
            <Route path={'/'} element={<TodolistsList />} />
            <Route path={'/login'} element={<Login />} />
            <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>} />
            <Route path='*' element={<Navigate to='/404' />} />
          </Routes>
        </Container>
      </div>
    </HashRouter>
  )
}

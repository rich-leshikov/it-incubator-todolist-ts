import { AppBarComponent } from 'features/AppBarComponent/AppBarComponent'
import { CircularProgress, Container } from '@mui/material'
import { TodolistsList } from 'features/TodolistsList/TodolistsList'
import { ErrorSnackbar } from 'components/ErrorSnackbar/ErrorSnackbar'
import { useAppDispatch } from './store'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Login } from 'features/Login/Login'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { initializeAppTC } from 'app/app-reducer'
import * as appSelectors from 'app/app-selectors'

export function App() {
  // console.log('render App')

  const isInitialized = useSelector(appSelectors.isInitialized)
  const dispatch = useAppDispatch()

  // console.log('isAppInitialized: ', isInitialized)

  useEffect(() => {
    dispatch(initializeAppTC())
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

import {AppBarComponent} from '../features/AppBarComponent/AppBarComponent'
import {Container} from '@mui/material'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {store, useAppDispatch} from './store'
import {Provider} from 'react-redux'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {Login} from '../features/Login/Login'
import {useEffect} from 'react'
import {initializeAppTC} from './app-reducer'


export function App() {
  // console.log('render app')
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initializeAppTC())
  }, [])

  return (
    <BrowserRouter>
      <div className="App">
        <ErrorSnackbar/>
        <AppBarComponent/>
        <Container fixed>
          <Routes>
            <Route path={'/'} element={<TodolistsList/>}/>
            <Route path={'/login'} element={<Login/>}/>
            <Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>}/>
            <Route path="*" element={<Navigate to="/404"/>}/>
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  )
}

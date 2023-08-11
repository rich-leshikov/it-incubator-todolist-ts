import { AppBarComponent } from '../features/AppBarComponent/AppBarComponent'
import { CircularProgress, Container } from '@mui/material'
import { TodolistsList } from '../features/TodolistsList/TodolistsList'
import { ErrorSnackbar } from '../components/ErrorSnackbar/ErrorSnackbar'
import { AppRootStateType, useAppDispatch } from './store'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Login } from '../features/Login/Login'
import { useEffect } from 'react'
import { initializeAppTC } from './app-reducer'
import { useSelector } from 'react-redux'

export function App() {
	// console.log('render app')
	const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
	const dispatch = useAppDispatch()

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
		<BrowserRouter>
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
		</BrowserRouter>
	)
}

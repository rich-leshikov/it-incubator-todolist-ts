import {AppBarComponent} from '../features/AppBarComponent/AppBarComponent'
import {Container} from '@mui/material'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {store} from './store'
import {Provider} from 'react-redux'


export function App() {
  // console.log('render app')

  return (
    <Provider store={store}>
      <div className="App">
        <ErrorSnackbar/>
        <AppBarComponent/>
        <Container fixed>
          <TodolistsList/>
        </Container>
      </div>
    </Provider>
  )
}

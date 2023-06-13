import {AppBarComponent} from '../features/AppBarComponent/AppBarComponent';
import {Container} from '@mui/material';
import {TodolistsList} from '../features/TodolistsList/TodolistsList';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar';


export function App() {
  // console.log('render app')

  return (
    <div className="App">
      <ErrorSnackbar/>
      <AppBarComponent/>
      <Container fixed>
        <TodolistsList/>
      </Container>
    </div>
  )
}

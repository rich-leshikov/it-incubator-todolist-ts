import {AppBarComponent} from '../features/AppBarComponent/AppBarComponent';
import {Container} from '@mui/material';
import {TodolistsList} from '../features/TodolistsList/TodolistsList';


export function App() {
  // console.log('render app')

  return (
    <div className="App">
      <AppBarComponent/>
      <Container fixed>
        <TodolistsList/>
      </Container>
    </div>
  )
}

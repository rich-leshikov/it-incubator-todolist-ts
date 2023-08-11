import ReactDOM from 'react-dom/client'
import './index.css'
import { App } from './app/App'
import { store } from './app/store'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
)

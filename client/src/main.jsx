import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './Components/Slices/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './Components/Slices/store.js'
ReactDOM.createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>

  <Provider store={store}>
  <BrowserRouter>
  <React.StrictMode>

    <App />
  </React.StrictMode>
  </BrowserRouter>
  </Provider>
  </PersistGate>
)

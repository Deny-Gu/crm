import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './providers/AuthProvider'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { registerSW } from 'virtual:pwa-register'
import moment from 'moment/moment';
import 'moment/locale/ru'; 

import 'bootstrap/dist/css/bootstrap.min.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import './index.scss'

moment.locale('ru');

ReactDOM.createRoot(document.getElementById('root')!).render(
<React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
            <App />
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)

// Регистрируем service worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Доступна новая версия приложения. Обновить?")) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log("Приложение готово к офлайн-режиму")
  },
})
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'
import axios from 'axios'

// if using docker
axios.defaults.baseURL = 'http://192.168.1.101:8082'
// 'https://app.swaggerhub.com/apis/JURAJPASKA8_1/UserManagementApi/1.0.0'

//'http://localhost:5000'
//  'https://virtserver.swaggerhub.com/semjacko/Activities/1.0.0'

axios.interceptors.request.use(
  config => {
    //const token = localStorageService.getAccessToken()
    // if (token) {
    //   config.headers['Authorization'] = 'Bearer ' + token
    // }
    console.log(config)
    if (config?.headers) {
      //const newConfig = { ...config }
      config.headers['Content-Type'] = 'application/json'

      return config
    }
  },
  error => {
    Promise.reject(error)
  }
)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

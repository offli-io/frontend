export const useServiceInterceptors = () => {
  console.log('using service interceptors')
}

// import axios from 'axios'

// // Add a request interceptor
// axios.interceptors.request.use(
//   config => {
//     //const token = localStorageService.getAccessToken()
//     // if (token) {
//     //   config.headers['Authorization'] = 'Bearer ' + token
//     // }

//     config?.headers?.['Content-Type'] = 'application/json'
//     return config
//   },
//   error => {
//     Promise.reject(error)
//   }
// )

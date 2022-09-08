// import { GoogleLoginResponse } from 'react-google-login'

export const refreshTokenSetup = (res: any) => {
  let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000
  return refreshTiming
}

//   const refreshToken = async () => {
//     const newAuthRes = await res.reloadAuthResponse()
//     refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000
//     console.log('new auth token', newAuthRes.id_token)
//     setTimeout(refreshToken, refreshTiming)
//   }
//   setTimeout(refreshToken, refreshTiming)
// }

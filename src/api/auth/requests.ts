import { DEFAULT_DEV_URL } from '../../assets/config'
import { ILoginRequestDto } from '../../types/auth/login-request.dto'
import { ILoginResponseDto } from '../../types/auth/login-response.dto'
import axios from 'axios'

export const refreshTokenSetup = (res: any) => {
  const refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000
  return refreshTiming
}

export const loginUser = (values: ILoginRequestDto) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.post<ILoginResponseDto>(
    `${DEFAULT_DEV_URL}/login`,
    values,
    {
      cancelToken: source?.token,
    }
  )
  return promise
}

//   const refreshToken = async () => {
//     const newAuthRes = await res.reloadAuthResponse()
//     refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000
//     console.log('new auth token', newAuthRes.id_token)
//     setTimeout(refreshToken, refreshTiming)
//   }
//   setTimeout(refreshToken, refreshTiming)
// }

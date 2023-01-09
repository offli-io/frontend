import { useQuery } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { getNotifications } from '../api/notifications/requests'

export const useNotifications = (userId?: string) => {
  const { enqueueSnackbar } = useSnackbar()
  const { data, isLoading } = useQuery(
    ['notifications', userId],
    () => getNotifications(userId ?? ''),
    {
      enabled: !!userId,
      onError: () => {
        //some generic toast for every hook
        enqueueSnackbar('Failed to load notifications', { variant: 'error' })
      },
    }
  )

  return { data, isLoading }
}

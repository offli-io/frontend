import { useQuery } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { getActivity, getUsers } from '../api/activities/requests'
import { getNotifications } from '../api/notifications/requests'

export const useActivities = <T>({ id }: { id?: string } = {}) => {
  const { enqueueSnackbar } = useSnackbar()
  const { data, isLoading } = useQuery(
    ['activities', id],
    () => getActivity<T>({ id }),
    {
      onError: () => {
        //some generic toast for every hook
        enqueueSnackbar(`Failed to load activit${id ? 'y' : 'ies'}`, {
          variant: 'error',
        })
      },
    }
  )

  return { data, isLoading }
}

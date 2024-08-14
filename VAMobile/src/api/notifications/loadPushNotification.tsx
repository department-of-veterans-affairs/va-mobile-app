import { useQuery } from '@tanstack/react-query'

import queryClient from 'api/queryClient'
import { LoadPushNotificationData } from 'api/types'

import { notificationKeys } from './queryKeys'

/**
 * Fetch user push notification
 */
const loadPushNotification = async (): Promise<LoadPushNotificationData | undefined> => {
  const previousData = queryClient.getQueryData(notificationKeys.settings) as LoadPushNotificationData
  return {
    initialUrl: previousData?.initialUrl,
    tappedForegroundNotification: previousData?.tappedForegroundNotification || false,
  }
}

/**
 * Returns a query for user push notification
 */
export const useLoadPushNotification = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: notificationKeys.notificationData,
    queryFn: () => loadPushNotification(),
    meta: {
      errorName: 'useLoadPushNotification: Service error',
    },
  })
}

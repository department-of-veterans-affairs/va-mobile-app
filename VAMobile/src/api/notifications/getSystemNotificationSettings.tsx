import { useQuery } from '@tanstack/react-query'

import { LoadSystemNotificationsData } from 'api/types'
import { notificationsEnabled } from 'utils/notifications'

import { notificationKeys } from './queryKeys'

/**
 * Fetch user system notification settings
 */
const getSystemNotificationsSettings = async (): Promise<LoadSystemNotificationsData | undefined> => {
  const systemNotificationsOn = await notificationsEnabled()
  return {
    systemNotificationsOn,
  }
}

/**
 * Returns a query for user system notification settings
 */
export const useSystemNotificationsSettings = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: notificationKeys.systemSettings,
    queryFn: () => getSystemNotificationsSettings(),
    meta: {
      errorName: 'getSystemNotificationsSettings: Failed to retrieve system notification setting',
    },
  })
}

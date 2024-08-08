import { useQuery } from '@tanstack/react-query'

import { LoadSystemNotificationsData } from 'api/types'
import { notificationsEnabled } from 'utils/notifications'

import { notificationKeys } from './queryKeys'

/**
 * Fetch user system notification settings
 */
const loadSystemNotificationsSettings = async (): Promise<LoadSystemNotificationsData | undefined> => {
  const systemNotificationsOn = await notificationsEnabled()
  return {
    systemNotificationsOn: systemNotificationsOn,
  }
}

/**
 * Returns a query for user system notification settings
 */
export const useLoadSystemNotificationsSettings = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: notificationKeys.systemNotifications,
    queryFn: () => loadSystemNotificationsSettings(),
    meta: {
      errorName: 'loadPushPreferences: Service error',
    },
  })
}

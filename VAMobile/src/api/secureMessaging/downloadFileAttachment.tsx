import FileViewer from 'react-native-file-viewer'

import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'

import { errorKeys } from 'api/errors'
import { ErrorData, SecureMessagingAttachment } from 'api/types'
import { downloadFile, unlinkFile } from 'utils/filesystem'

import { secureMessagingKeys } from './queryKeys'

/**
 * Fetch user attachment
 */
const downloadFileAttachment = async (
  file: SecureMessagingAttachment,
  queryClient: QueryClient,
): Promise<boolean | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === secureMessagingKeys.downloadFileAttachment[0]) {
        throw error.error
      }
    })
  }
  const filePath = await downloadFile('GET', file.link, file.filename)
  if (filePath) {
    await FileViewer.open(filePath, {
      onDismiss: async (): Promise<void> => {
        await unlinkFile(filePath)
      },
    })
    return true
  }
}

/**
 * Returns a query for a user attachment
 */
export const useDownloadFileAttachment = (file: SecureMessagingAttachment, options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()
  return useQuery({
    ...options,
    queryKey: [secureMessagingKeys.downloadFileAttachment, file.link, file.filename],
    queryFn: () => downloadFileAttachment(file, queryClient),
    meta: {
      errorName: 'downloadFileAttachment: Service error',
    },
  })
}

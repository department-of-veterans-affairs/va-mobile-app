import FileViewer from 'react-native-file-viewer'

import { useQuery } from '@tanstack/react-query'

import { medicalCopayKeys } from 'api/medicalCopays/queryKeys'
import getEnv from 'utils/env'
import { downloadFile, unlinkFile } from 'utils/filesystem'

const { API_ROOT } = getEnv()

const createCopayStatementFileName = (id: string) => `VA-Medical-Copay-Statement-${id}.pdf`

/**
 * Downloads and opens the PDF statement for a given copay statement ID.
 */
export const downloadCopayStatement = async (id: string, fileName?: string): Promise<boolean> => {
  const escapedId = encodeURI(id)
  const url = `${API_ROOT}/v0/medical_copays/download/${escapedId}`

  const localName = (fileName ?? createCopayStatementFileName(id)).trim()

  try {
    const filePath = await downloadFile('GET', url, localName, undefined, 3)
    if (!filePath) throw new Error('Download returned no file path')

    await FileViewer.open(filePath, {
      onDismiss: async (): Promise<void> => {
        await unlinkFile(filePath)
      },
    })
    return true
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to download or open statement')
  }
}

export const useDownloadCopayStatement = (id: string, options?: { enabled?: boolean; fileName?: string }) => {
  return useQuery({
    ...options,
    queryKey: [medicalCopayKeys.downloadCopayStatement, id],
    queryFn: () => downloadCopayStatement(id, options?.fileName),
    meta: {
      errorName: 'downloadCopayStatement: Service error',
    },
  })
}

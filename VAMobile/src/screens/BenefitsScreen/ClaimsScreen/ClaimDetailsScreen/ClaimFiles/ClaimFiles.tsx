import React from 'react'
import { useTranslation } from 'react-i18next'

import { useIsFocused } from '@react-navigation/native'

import _ from 'underscore'

import { ClaimData, ClaimEFolderDocuments } from 'api/types'
import { Box, DefaultList, DefaultListItemObj, TextLine, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type ClaimFilesProps = {
  claim: ClaimData
  eFolderDocuments?: Array<ClaimEFolderDocuments>
  setDownloadFile: React.Dispatch<React.SetStateAction<boolean>>
  setDocumentID: React.Dispatch<React.SetStateAction<string>>
  setFileName: React.Dispatch<React.SetStateAction<string>>
}

function ClaimFiles({ claim, eFolderDocuments, setDownloadFile, setDocumentID, setFileName }: ClaimFilesProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const isFocused = useIsFocused()
  const { attributes } = claim
  const events = attributes.eventsTimeline.filter(
    (event) => (event.filename && event.filename.length > 0) || (event.documents && event.documents.length > 0),
  )
  const files = (): Array<DefaultListItemObj> => {
    const items: Array<DefaultListItemObj> = []

    _.forEach(events, (event) => {
      if (event.filename) {
        const textLines: TextLine[] = [{ text: event.filename, variant: 'MobileBodyBold' }]
        if (event.type) {
          textLines.push({ text: t('appointmentList.requestType', { type: event.type }) })
        }
        if (event.documentType) {
          textLines.push({ text: t('appointmentList.documentType', { type: event.documentType }) })
        }
        if (event.uploadDate) {
          textLines.push({ text: t('appointmentList.received', { date: formatDateMMMMDDYYYY(event.uploadDate) }) })
        }
        items.push({
          textLines: textLines,
          onPress:
            event.documentId &&
            eFolderDocuments &&
            eFolderDocuments.filter((doc) => doc.id === event.documentId).length > 0
              ? () => {
                  setDocumentID(event?.documentId || '')
                  setFileName(event?.filename || '')
                  setDownloadFile(true)
                }
              : undefined,
        })
      } else {
        _.forEach(event.documents || [], (document) => {
          if (document.filename) {
            const textLines: TextLine[] = [{ text: document.filename, variant: 'MobileBodyBold' }]
            if (document.fileType) {
              textLines.push({ text: t('appointmentList.requestType', { type: document.fileType }) })
            }
            if (document.documentType) {
              textLines.push({ text: t('appointmentList.documentType', { type: document.documentType }) })
            }
            if (document.uploadDate) {
              textLines.push({
                text: t('appointmentList.received', { date: formatDateMMMMDDYYYY(document.uploadDate) }),
              })
            }
            items.push({
              textLines: textLines,
              onPress:
                document.documentId &&
                eFolderDocuments &&
                eFolderDocuments.filter((doc) => doc.id === document.documentId).length > 0
                  ? () => {
                      setDocumentID(document?.documentId || '')
                      setFileName(document?.filename || '')
                      setDownloadFile(true)
                    }
                  : undefined,
            })
          }
        })
      }
    })
    return items
  }
  const filesList = files()
  if (isFocused && filesList.length > 0) {
    return (
      <Box>
        <DefaultList items={files()} />
      </Box>
    )
  }
  return (
    <Box mx={theme.dimensions.gutter} my={theme.dimensions.fullScreenContentButtonHeight}>
      <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header">
        {t('claimDetails.noFiles')}
      </TextView>
    </Box>
  )
}

export default ClaimFiles

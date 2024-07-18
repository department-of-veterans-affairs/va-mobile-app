import React from 'react'
import { useTranslation } from 'react-i18next'

import _ from 'underscore'

import { ClaimData } from 'api/types'
import { Box, DefaultList, DefaultListItemObj, TextLine, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type ClaimFilesProps = {
  claim: ClaimData
}

function ClaimFiles({ claim }: ClaimFilesProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { attributes } = claim
  const documents = attributes.eventsTimeline.filter((event) => event.filename && event.filename.length > 0)
  const files = (): Array<DefaultListItemObj> => {
    const items: Array<DefaultListItemObj> = []

    _.forEach(documents, (document) => {
      if (document.filename) {
        const textLines: TextLine[] = [{ text: document.filename, variant: 'MobileBodyBold' }]
        if (document.type) {
          textLines.push({ text: t('appointmentList.requestType', { type: document.type }) })
        }
        if (document.documentType) {
          textLines.push({ text: t('appointmentList.documentType', { type: document.documentType }) })
        }
        if (document.uploadDate) {
          textLines.push({ text: t('appointmentList.received', { date: document.uploadDate }) })
        }
        items.push({ textLines: textLines })
      }
    })
    return items
  }
  const filesList = files()
  if (filesList.length > 0) {
    return (
      <Box>
        <DefaultList items={files()} />
      </Box>
    )
  }
  return (
    <Box
      mx={theme.dimensions.gutter}
      mt={theme.dimensions.standardMarginBetween}
      mb={theme.dimensions.fullScreenContentButtonHeight}>
      <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header">
        {t('claimDetails.noFiles')}
      </TextView>
    </Box>
  )
}

export default ClaimFiles

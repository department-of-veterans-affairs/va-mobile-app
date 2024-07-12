import React from 'react'
import { useTranslation } from 'react-i18next'

import _ from 'underscore'

import { ClaimData } from 'api/types'
import { Box, DefaultList, DefaultListItemObj } from 'components'
import { NAMESPACE } from 'constants/namespaces'

type ClaimFilesProps = {
  claim: ClaimData
}

function ClaimFiles({ claim }: ClaimFilesProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { attributes } = claim
  const documents = attributes.eventsTimeline.filter((event) => event.filename && event.filename.length > 0)
  const files = (): Array<DefaultListItemObj> => {
    const items: Array<DefaultListItemObj> = []

    _.forEach(documents, (document) => {
      if (document.filename) {
        items.push({
          textLines: [
            { text: document.filename, variant: 'MobileBodyBold' },
            { text: t('appointmentList.requestType', { type: document.type }) },
            { text: t('appointmentList.documentType', { type: document.documentType }) },
            { text: t('appointmentList.received', { date: document.uploadDate }) },
          ],
        })
      }
    })
    return items
  }
  return (
    <Box>
      <DefaultList items={files()} />
    </Box>
  )
}

export default ClaimFiles

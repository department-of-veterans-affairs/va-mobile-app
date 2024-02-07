import { useTranslation } from 'react-i18next'
import React from 'react'

import { AlertBox, Box } from 'components'
import { ClaimAttributesData } from 'store/api'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { getUserPhase, needItemsFromVet, numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import ClaimPhase from './ClaimPhase'
import theme from 'styles/themes/standardTheme'

export type ClaimTimelineProps = {
  /** attributes object from ClaimData */
  attributes: ClaimAttributesData
  /** given claims ID */
  claimID: string
}

function ClaimTimeline({ attributes, claimID }: ClaimTimelineProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const count = numberOfItemsNeedingAttentionFromVet(attributes.eventsTimeline)
  const itemsNeededFromVet = needItemsFromVet(attributes)
  // need to check and see if there is a warning box above and adjust margins accordingly
  const mt = itemsNeededFromVet ? 0 : theme.dimensions.condensedMarginBetween

  return (
    <Box>
      {itemsNeededFromVet && !attributes.waiverSubmitted && (
        <Box my={theme.dimensions.standardMarginBetween}>
          <AlertBox border={'warning'} titleA11yLabel={a11yLabelVA(t('claimPhase.youHaveFileRequest', { count }))} title={t('claimPhase.youHaveFileRequest', { count })} />
        </Box>
      )}
      <Box borderColor={'primary'} borderTopWidth={theme.dimensions.borderWidth} mt={mt} mb={theme.dimensions.condensedMarginBetween}>
        {[1, 2, 3, 4, 5].map((phase) => (
          <ClaimPhase phase={phase} current={getUserPhase(attributes.phase)} attributes={attributes} claimID={claimID} key={phase} />
        ))}
      </Box>
    </Box>
  )
}

export default ClaimTimeline

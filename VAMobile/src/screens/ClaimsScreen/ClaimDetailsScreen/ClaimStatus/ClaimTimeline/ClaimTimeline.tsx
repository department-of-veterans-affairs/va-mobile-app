import React, { FC } from 'react'

import { AlertBox, Box } from 'components'
import { ClaimAttributesData } from 'store/api'
import { NAMESPACE } from 'constants/namespaces'
import { getUserPhase, needItemsFromVet, numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import { useTranslation } from 'utils/hooks'
import ClaimPhase from './ClaimPhase'
import theme from 'styles/themes/standardTheme'

/**
 * Props for ClaimTimeline component
 */
export type ClaimTimelineProps = {
  /** attributes object from ClaimData */
  attributes: ClaimAttributesData
  /** given claims ID */
  claimID: string
}

/** component that renders the complete timeline of a claim */
const ClaimTimeline: FC<ClaimTimelineProps> = ({ attributes, claimID }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)

  const numberOfRequests = numberOfItemsNeedingAttentionFromVet(attributes.eventsTimeline)
  const itemsNeededFromVet = needItemsFromVet(attributes)
  // need to check and see if there is a warning box above and adjust margins accordingly
  const mt = itemsNeededFromVet ? 0 : theme.dimensions.condensedMarginBetween

  return (
    <Box>
      {itemsNeededFromVet && !attributes.waiverSubmitted && (
        <Box mx={theme.dimensions.gutter} my={theme.dimensions.standardMarginBetween}>
          <AlertBox border={'warning'} background={'noCardBackground'} title={t(`claimPhase.youHaveFileRequest${numberOfRequests !== 1 ? 's' : ''}`, { numberOfRequests })} />
        </Box>
      )}
      <Box borderColor={'primary'} borderTopWidth={theme.dimensions.borderWidth} mt={mt} mb={theme.dimensions.condensedMarginBetween}>
        <ClaimPhase phase={1} current={getUserPhase(attributes.phase)} attributes={attributes} claimID={claimID} />
        <ClaimPhase phase={2} current={getUserPhase(attributes.phase)} attributes={attributes} claimID={claimID} />
        <ClaimPhase phase={3} current={getUserPhase(attributes.phase)} attributes={attributes} claimID={claimID} />
        <ClaimPhase phase={4} current={getUserPhase(attributes.phase)} attributes={attributes} claimID={claimID} />
        <ClaimPhase phase={5} current={getUserPhase(attributes.phase)} attributes={attributes} claimID={claimID} />
      </Box>
    </Box>
  )
}

export default ClaimTimeline

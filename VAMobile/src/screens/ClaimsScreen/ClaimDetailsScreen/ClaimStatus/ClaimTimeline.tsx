import { AlertBox, Box } from 'components'
import { ClaimAttributesData } from 'store/api'
import { getUserPhase, itemsNeedingAttentionFromVet, needItemsFromVet } from 'utils/claims'
import { useTranslation } from 'utils/hooks'
import ClaimPhase from './ClaimPhase'
import React, { FC } from 'react'
import theme from 'styles/themes/standardTheme'

/**
 * Props for ClaimTimeline component
 */
export type ClaimTimelineProps = {
  /** attributes object from ClaimData */
  attributes: ClaimAttributesData
}

/** component that renders the complete timeline of a claim */
const ClaimTimeline: FC<ClaimTimelineProps> = ({ attributes }) => {
  const t = useTranslation()
  // need to check and see if there is a warning box above and adjust margins accordingly
  const mt = needItemsFromVet(attributes) ? 0 : theme.dimensions.marginBetweenCards

  return (
    <Box mt={mt} mb={theme.dimensions.marginBetweenCards}>
      {needItemsFromVet(attributes) && (
        <Box mx={theme.dimensions.gutter} my={theme.dimensions.marginBetween}>
          <AlertBox
            border={'warning'}
            background={'noCardBackground'}
            title={t('claimTimeLine.fileRequestWarning', { numberOfRequests: itemsNeedingAttentionFromVet(attributes.eventsTimeline) })}
          />
        </Box>
      )}
      <ClaimPhase phase={1} current={getUserPhase(attributes.phase)} attributes={attributes} />
      <ClaimPhase phase={2} current={getUserPhase(attributes.phase)} attributes={attributes} />
      <ClaimPhase phase={3} current={getUserPhase(attributes.phase)} attributes={attributes} />
      <ClaimPhase phase={4} current={getUserPhase(attributes.phase)} attributes={attributes} />
      <ClaimPhase phase={5} current={getUserPhase(attributes.phase)} attributes={attributes} />
    </Box>
  )
}

export default ClaimTimeline

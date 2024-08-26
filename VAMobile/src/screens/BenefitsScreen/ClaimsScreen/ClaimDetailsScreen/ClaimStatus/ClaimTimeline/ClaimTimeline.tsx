import React, { RefObject } from 'react'
import { ScrollView } from 'react-native'

import { useIsFocused } from '@react-navigation/native'

import { ClaimAttributesData } from 'api/types'
import { Box } from 'components'
import theme from 'styles/themes/standardTheme'
import { getUserPhase, isDisabilityCompensationClaim, needItemsFromVet } from 'utils/claims'
import { featureEnabled } from 'utils/remoteConfig'

import ClaimPhase from './ClaimPhase'
import DEPRECATED_ClaimPhase from './DEPRECATED_ClaimPhase'

export type ClaimTimelineProps = {
  /** attributes object from ClaimData */
  attributes: ClaimAttributesData
  /** given claims ID */
  claimID: string
  /** enable autoScroll */
  scrollIsEnabled: boolean
  /** ref to parent scrollView, used for auto scroll */
  scrollViewRef: RefObject<ScrollView>
}

function ClaimTimeline({ attributes, claimID, scrollIsEnabled, scrollViewRef }: ClaimTimelineProps) {
  const isFocused = useIsFocused()
  const itemsNeededFromVet = needItemsFromVet(attributes)
  // need to check and see if there is a warning box above and adjust margins accordingly
  const mt = itemsNeededFromVet ? 0 : theme.dimensions.condensedMarginBetween

  const is8Steps = featureEnabled('claimPhaseExpansion') && isDisabilityCompensationClaim(attributes.claimTypeCode)
  const claimStepList = is8Steps ? [1, 2, 3, 4, 5, 6, 7, 8] : [1, 2, 3, 4, 5]

  return (
    <Box>
      <Box
        borderColor={'primary'}
        borderTopWidth={theme.dimensions.borderWidth}
        mt={mt}
        mb={theme.dimensions.condensedMarginBetween}>
        {isFocused &&
          claimStepList.map((phase) =>
            featureEnabled('claimPhaseExpansion') ? (
              <ClaimPhase
                phase={phase}
                attributes={attributes}
                claimID={claimID}
                scrollIsEnabled={scrollIsEnabled}
                scrollViewRef={scrollViewRef}
                key={phase}
              />
            ) : (
              <DEPRECATED_ClaimPhase
                phase={phase}
                current={getUserPhase(attributes.phase)}
                attributes={attributes}
                claimID={claimID}
                key={phase}
              />
            ),
          )}
      </Box>
    </Box>
  )
}

export default ClaimTimeline

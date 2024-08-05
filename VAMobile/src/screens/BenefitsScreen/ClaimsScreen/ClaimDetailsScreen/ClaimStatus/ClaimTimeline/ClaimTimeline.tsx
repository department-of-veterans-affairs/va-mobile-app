import React from 'react'

import { useIsFocused } from '@react-navigation/native'

import { ClaimAttributesData } from 'api/types'
import { Box } from 'components'
import theme from 'styles/themes/standardTheme'
import { getUserPhase } from 'utils/claims'

import ClaimPhase from './ClaimPhase'

export type ClaimTimelineProps = {
  /** attributes object from ClaimData */
  attributes: ClaimAttributesData
  /** given claims ID */
  claimID: string
}

function ClaimTimeline({ attributes, claimID }: ClaimTimelineProps) {
  const isFocused = useIsFocused()
  return (
    <Box>
      {isFocused && (
        <Box
          borderColor={'primary'}
          borderTopWidth={theme.dimensions.borderWidth}
          my={theme.dimensions.condensedMarginBetween}>
          {[1, 2, 3, 4, 5].map((phase) => (
            <ClaimPhase
              phase={phase}
              current={getUserPhase(attributes.phase)}
              attributes={attributes}
              claimID={claimID}
              key={phase}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default ClaimTimeline

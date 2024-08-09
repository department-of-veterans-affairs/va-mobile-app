import React, { RefObject, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { useFocusEffect } from '@react-navigation/native'

import { ClaimAttributesData } from 'api/types'
import { AlertBox, Box } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import theme from 'styles/themes/standardTheme'
import { a11yLabelVA } from 'utils/a11yLabel'
import {
  getUserPhase,
  isDisabilityCompensationClaim,
  needItemsFromVet,
  numberOfItemsNeedingAttentionFromVet,
} from 'utils/claims'
import { featureEnabled } from 'utils/remoteConfig'

import ClaimPhase from './ClaimPhase'
import DEPRECATED_ClaimPhase from './DEPRECATED_ClaimPhase'

export type ClaimTimelineProps = {
  /** attributes object from ClaimData */
  attributes: ClaimAttributesData
  /** given claims ID */
  claimID: string
  /** ref to parent scrollView, used for auto scroll */
  scrollViewRef: RefObject<ScrollView>
}

function ClaimTimeline({ attributes, claimID, scrollViewRef }: ClaimTimelineProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const [count, setCount] = useState(0)
  const itemsNeededFromVet = needItemsFromVet(attributes)
  // need to check and see if there is a warning box above and adjust margins accordingly
  const mt = itemsNeededFromVet && !featureEnabled('claimPhaseExpansion') ? 0 : theme.dimensions.condensedMarginBetween

  const is8Steps = featureEnabled('claimPhaseExpansion') && isDisabilityCompensationClaim(attributes.claimTypeCode)
  const claimStepList = is8Steps ? [1, 2, 3, 4, 5, 6, 7, 8] : [1, 2, 3, 4, 5]

  useFocusEffect(
    useCallback(() => {
      setCount(numberOfItemsNeedingAttentionFromVet(attributes.eventsTimeline))
    }, [attributes]),
  ) //force a rerender due to react query updating data

  return (
    <Box>
      {itemsNeededFromVet && !attributes.waiverSubmitted && !featureEnabled('claimPhaseExpansion') && (
        <Box my={theme.dimensions.standardMarginBetween}>
          <AlertBox
            border={'warning'}
            titleA11yLabel={a11yLabelVA(t('claimPhase.youHaveFileRequest', { count }))}
            title={t('claimPhase.youHaveFileRequest', { count })}
          />
        </Box>
      )}
      <Box
        borderColor={'primary'}
        borderTopWidth={theme.dimensions.borderWidth}
        mt={mt}
        mb={theme.dimensions.condensedMarginBetween}>
        {claimStepList.map((phase) =>
          featureEnabled('claimPhaseExpansion') ? (
            <ClaimPhase
              phase={phase}
              attributes={attributes}
              claimID={claimID}
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

import { Box, TextArea, TextView, VAButton, VAIcon, VAIconProps, VA_ICON_MAP } from 'components'
import { ClaimAttributesData } from 'store/api'
import { Pressable } from 'react-native'
import { itemsNeedingAttentionFromVet, needItemsFromVet } from '../../utils/claims'
import PhaseIndicatorRough from './PhaseIndicatorRough'
import React, { FC, useState } from 'react'
import theme from '../../styles/themes/standardTheme'

export type ClaimPhaseRoughProps = {
  phase: number
  current: number
  attributes: ClaimAttributesData
  updatedDate?: string
}

const getHeading = (phase: number): string => {
  switch (phase) {
    case 1: {
      return 'Claim Received'
    }
    case 2: {
      return 'Initial Review'
    }
    case 3: {
      return 'Evidence gathering, review, and decision'
    }
    case 4: {
      return 'Preparation for notification'
    }
    case 5: {
      return 'Complete'
    }
  }
  return ''
}

const getDetails = (phase: number): string => {
  switch (phase) {
    case 1: {
      return 'Thank you. VA received your claim'
    }
    case 2: {
      return 'Your claim has been assigned to a reviewer who is determining if additional information is needed.'
    }
    case 3: {
      return 'If we need more information, we’ll request it from you, health care providers, governmental agencies, or others. Once we have all the information we need, we’ll review it and send your claim to the rating specialist for a decision.'
    }
    case 4: {
      return 'We are preparing your claim decision packet to be mailed.'
    }
    case 5: {
      return 'Complete'
    }
  }
  return ''
}

// TODO: Update VA Button to have optional marginY attribute to reduce bottom spacing in this comppnent on phase 3

// TODO: Documentation

const ClaimPhaseRough: FC<ClaimPhaseRoughProps> = ({ phase, current, updatedDate, attributes }) => {
  const [expanded, setExpanded] = useState(false)
  const iconName: keyof typeof VA_ICON_MAP = expanded ? 'ArrowUp' : 'ArrowDown'

  return (
    <TextArea>
      <Box flexDirection={'row'}>
        <PhaseIndicatorRough phase={phase} current={current} />
        <Box flexDirection={'column'} justifyContent={'flex-start'} flex={1}>
          <TextView variant={'MobileBodyBold'}>{getHeading(phase)}</TextView>
          {phase <= current && <TextView variant={'MobileBody'}>{updatedDate}</TextView>}
        </Box>
        {phase <= current && (
          <Pressable onPress={(): void => setExpanded(!expanded)}>
            <VAIcon name={iconName} fill={'#000'} />
          </Pressable>
        )}
      </Box>
      {expanded && (
        <Box mt={theme.dimensions.marginBetweenCards}>
          <TextView variant={'MobileBody'}>{getDetails(phase)}</TextView>
        </Box>
      )}
      {phase === 3 && needItemsFromVet(attributes) && (
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBodyBold'}>You have {itemsNeedingAttentionFromVet(attributes.eventsTimeline)} file requests from VA</TextView>
          <VAButton onPress={() => {}} label={'View File Requests'} textColor={'primaryContrast'} backgroundColor={'button'} />
        </Box>
      )}
    </TextArea>
  )
}

export default ClaimPhaseRough

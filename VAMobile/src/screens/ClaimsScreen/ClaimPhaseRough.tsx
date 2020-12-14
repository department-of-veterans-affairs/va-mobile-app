import { Box, TextArea, TextView, VAIcon, VAIconProps, VA_ICON_MAP } from 'components'
import { Pressable } from 'react-native'
import PhaseIndicatorRough from './PhaseIndicatorRough'
import React, { FC, useState } from 'react'
import theme from '../../styles/themes/standardTheme'

export type ClaimPhaseRoughProps = {
  phase: number
  current: number
  updatedDate?: string
}

const getHeading = (phase: number) => {
  switch (phase) {
    case 1: {
      return 'Claim Received'
    }
    case 2: {
      return 'Initial Review'
    }
    case 3: {
      return 'Evidence gathering, review and decision'
    }
    case 4: {
      return 'Preparation for notification'
    }
    case 5: {
      return 'Complete'
    }
  }
}

const getDetails = (phase: number) => {
  switch (phase) {
    case 1: {
      return 'Thank you. VA received your claim'
    }
    case 2: {
      return 'Initial Review'
    }
    case 3: {
      return 'Evidence gathering, review and decision'
    }
    case 4: {
      return 'Preparation for notification'
    }
    case 5: {
      return 'Complete'
    }
  }
}

const ClaimPhaseRough: FC<ClaimPhaseRoughProps> = ({ phase, current, updatedDate }) => {
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
    </TextArea>
  )
}

export default ClaimPhaseRough

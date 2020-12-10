import { Box, TextArea, TextView } from 'components'
import PhaseIndicatorRough from './PhaseIndicatorRough'
import React, { FC } from 'react'

export type ClaimPhaseRoughProps = {
  phase: number
  current: number
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

const getUpdatedDate = (phase: number, current: number, events: any) => {
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

const ClaimPhaseRough: FC<ClaimPhaseRoughProps> = ({ phase, current }) => {
  return (
    <TextArea>
      <Box flexDirection={'row'}>
        <PhaseIndicatorRough phase={phase} current={current} />
        <Box flexDirection={'column'} justifyContent={'flex-start'}>
          <TextView variant={'MobileBodyBold'}>{getHeading(phase)}</TextView>
          <TextView variant={'MobileBody'}>{}</TextView>
        </Box>
      </Box>
    </TextArea>
  )
}

export default ClaimPhaseRough

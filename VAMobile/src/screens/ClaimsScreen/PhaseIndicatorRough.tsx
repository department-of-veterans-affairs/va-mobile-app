import { Box, BoxProps, TextView, VAIcon } from 'components'
import { VABackgroundColors } from 'styles/theme'
import React, { FC } from 'react'
import theme from 'styles/themes/standardTheme'

export type PhaseIndicatorRoughProps = {
  phase: number
  current: number
}

const getBgColor = (phase: number, current: number): keyof VABackgroundColors => {
  if (phase < current) {
    return 'completedPhase'
  } else if (phase === current) {
    return 'currentPhase'
  } else {
    return 'upcomingPhase'
  }
}
const getCharacter = (phase: number, current: number) => {
  if (phase < current) {
    return (
      <Box justifyContent={'center'} alignItems={'center'}>
        <VAIcon width={15} height={15} name={'CheckMark'} fill="#fff" />
      </Box>
    )
  } else {
    return (
      <TextView variant="ClaimPhase" color="claimPhase" p={5} textAlign={'center'}>
        {phase}
      </TextView>
    )
  }
}

const PhaseIndicatorRough: FC<PhaseIndicatorRoughProps> = ({ phase, current }) => {
  const boxProps: BoxProps = {
    backgroundColor: getBgColor(phase, current),
    height: 30,
    width: 30,
    borderRadius: 30,
    justifyContent: 'center',
    mr: theme.dimensions.phaseIndicatorRightMargin,
  }

  if (phase === current) {
    boxProps.borderColor = 'claimStatus'
    boxProps.borderWidth = 2
  }
  return <Box {...boxProps}>{getCharacter(phase, current)}</Box>
}

export default PhaseIndicatorRough

import { Box, BoxProps, VAIcon } from 'components'
import { Text } from 'react-native'
import { VABackgroundColors } from '../../styles/theme'
import React, { FC } from 'react'

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
        <VAIcon width={20} height={20} name={'CheckMark'} fill="#fff" />
      </Box>
    )
  } else {
    return (
      // TODO: get fontFamily, fontSize, fontWeight from UI/UX.
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          padding: 5,
          lineHeight: 40, //Line height should equal box height below to center properly
          textAlign: 'center',
          color: '#fff',
        }}>
        {phase}
      </Text>
    )
  }
}

// TODO: need to make props constant and set up helper for bg and border colors based on complete/current/future phase
const PhaseIndicatorRough: FC<PhaseIndicatorRoughProps> = ({ phase, current }) => {
  const boxProps: BoxProps = {
    backgroundColor: getBgColor(phase, current),
    height: 40, // TODO: double check the size of this with UI
    width: 40,
    borderRadius: 40,
    justifyContent: 'center',
    mr: 10,
  }

  if (phase === current) {
    boxProps.borderColor = 'claimStatus'
    boxProps.borderWidth = 2
  }
  return <Box {...boxProps}>{getCharacter(phase, current)}</Box>
}

export default PhaseIndicatorRough

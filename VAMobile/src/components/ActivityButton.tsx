import React, { FC } from 'react'
import { Linking, Platform, Pressable, PressableStateCallbackType, ViewStyle } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'
import { colors } from '@department-of-veterans-affairs/mobile-tokens'

import { Box, TextView } from 'components'
import { useTheme } from 'utils/hooks'
import { WaygateToggleType, waygateNativeAlert } from 'utils/waygateConfig'

interface ActivityButtonProps {
  /** Text for header */
  title: string
  /** Text for activity information */
  subText: string
  /** Deep link to navigate to, excluding the prefix */
  deepLink: string
}

/**
 * Home screen activity button
 */
const ActivityButton: FC<ActivityButtonProps> = ({ title, subText, deepLink }: ActivityButtonProps) => {
  const theme = useTheme()

  const pressableStyle = ({ pressed }: PressableStateCallbackType): ViewStyle => ({
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: pressed
      ? theme.colors.buttonBackground.activityButtonActive
      : theme.colors.buttonBackground.activityButton,
    shadowColor: colors.vadsColorBlack,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  })

  const onActivityPress = () => {
    let useCaseOneString = ''
    if (deepLink === 'appointments') {
      useCaseOneString = 'Appointments'
    } else if (deepLink === 'claims') {
      useCaseOneString = 'ClaimsHistoryScreen'
    } else if (deepLink === 'messages') {
      useCaseOneString = 'SecureMessaging'
    } else if (deepLink === 'prescriptions') {
      useCaseOneString = 'PrescriptionHistory'
    }
    if (waygateNativeAlert(('WG_' + useCaseOneString) as WaygateToggleType)) {
      Linking.openURL(`vamobile://${deepLink}`)
    }
  }

  return (
    <Pressable
      style={pressableStyle}
      onPress={onActivityPress}
      accessible={true}
      accessibilityRole={'link'}
      accessibilityLabel={title}
      accessibilityValue={{ text: subText }}
      testID={title}>
      <Box flex={1} my={theme.dimensions.cardPadding} mx={theme.dimensions.buttonPadding}>
        <Box flexDirection={'row'} flexWrap={'wrap'} mb={subText ? theme.dimensions.standardMarginBetween : undefined}>
          <TextView variant="ActivityButtonHeader">{title}</TextView>
        </Box>
        {!!subText && (
          <Box flexDirection={'row'} alignItems="center">
            <Box flex={1}>
              <TextView variant={'ActivityButtonSubtext'}>{subText}</TextView>
            </Box>
            <Icon
              width={24}
              height={24}
              name={'ArrowCircleRight'}
              fill={theme.colors.icon.activityButton}
              preventScaling={true}
            />
          </Box>
        )}
      </Box>
    </Pressable>
  )
}

export default ActivityButton

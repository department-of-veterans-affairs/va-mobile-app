import React, { FC } from 'react'
import { Linking, Platform, Pressable, PressableStateCallbackType, ViewStyle } from 'react-native'

import { BackgroundVariant, Box, BoxProps, TextView, VAIcon } from 'components'
import { useTheme } from 'utils/hooks'
import { WaygateToggleType, waygateNativeAlert } from 'utils/waygateConfig'

import colors from '../styles/themes/VAColors'

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

  const boxProps: BoxProps = {
    style: {
      shadowColor: colors.black,
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
    },
  }

  const pressableStyles = ({ pressed }: PressableStateCallbackType): ViewStyle => ({
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: pressed
      ? theme.colors.buttonBackground.activityButtonActive
      : theme.colors.buttonBackground.activityButton,
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
    <Box {...boxProps}>
      <Pressable
        style={pressableStyles}
        onPress={onActivityPress}
        accessible={true}
        accessibilityRole={'link'}
        accessibilityLabel={title}
        accessibilityValue={{ text: subText }}
        testID={title}>
        <Box flex={1} my={theme.dimensions.cardPadding} mx={theme.dimensions.buttonPadding}>
          <Box
            flexDirection={'row'}
            flexWrap={'wrap'}
            mb={subText ? theme.dimensions.standardMarginBetween : undefined}>
            <TextView variant="ActivityButtonHeader">{title}</TextView>
          </Box>
          {!!subText && (
            <Box flexDirection={'row'} alignItems="center">
              <Box flex={1}>
                <TextView variant={'ActivityButtonSubtext'}>{subText}</TextView>
              </Box>
              <VAIcon
                width={24}
                height={24}
                name="RightArrowInCircle"
                fill={theme.colors.icon.activityButton}
                fill2={theme.colors.icon.transparent}
                ml={theme.dimensions.listItemDecoratorMarginLeft}
                preventScaling={true}
              />
            </Box>
          )}
        </Box>
      </Pressable>
    </Box>
  )
}

export default ActivityButton

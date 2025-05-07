import React, { FC } from 'react'
import { Platform, Pressable, PressableStateCallbackType, ViewStyle } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon'
import { colors } from '@department-of-veterans-affairs/mobile-tokens'

import { Box, TextView } from 'components'
import { useExternalLink, useTheme } from 'utils/hooks'

interface AnnouncementBannerProps {
  /** Text for announcement title */
  title: string
  /** External link used */
  link: string
  /** Optional accessibilityLabel */
  a11yLabel?: string
}

const AnnouncementBanner: FC<AnnouncementBannerProps> = ({ title, link, a11yLabel }: AnnouncementBannerProps) => {
  const theme = useTheme()
  const launchExternalLink = useExternalLink()

  const pressableStyle = ({ pressed }: PressableStateCallbackType): ViewStyle => ({
    flexDirection: 'row',
    paddingVertical: theme.dimensions.formMarginBetween,
    paddingHorizontal: theme.dimensions.cardPadding,
    backgroundColor: pressed ? theme.colors.background.listActive : theme.colors.buttonBackground.announcementBanner,
    shadowColor: colors.vadsColorBlack,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  })

  return (
    // eslint-disable-next-line react-native-a11y/has-accessibility-hint
    <Pressable
      style={pressableStyle}
      onPress={() => launchExternalLink(link)}
      accessible={true}
      accessibilityRole={'link'}
      accessibilityLabel={a11yLabel}
      testID={title}>
      <Box flexDirection={'row'} flex={1}>
        <Box flex={1}>
          <TextView variant="AnnouncementBannerTitle">{title}</TextView>
        </Box>
        <Icon preventScaling={true} name={'Launch'} fill={theme.colors.icon.announcementBanner} />
      </Box>
    </Pressable>
  )
}

export default AnnouncementBanner

import React, { FC } from 'react'
import { Linking, Platform, Pressable, ViewStyle } from 'react-native'

import { BackgroundVariant, Box, BoxProps, TextView, VAIcon } from 'components'
import { useTheme } from 'utils/hooks'

import colors from '../styles/themes/VAColors'

interface AnnouncementBannerProps {
  /** Text for announcement title */
  title: string
  /** link to navigate to, excluding the prefix */
  link: string
}

const AnnouncementBanner: FC<AnnouncementBannerProps> = ({ title, link }: AnnouncementBannerProps) => {
  const theme = useTheme()

  const boxProps: BoxProps = {
    borderRadius: 8,
    py: theme.dimensions.cardPadding,
    px: theme.dimensions.buttonPadding,
    backgroundColor: theme.colors.buttonBackground.activityButton as BackgroundVariant,
  }

  const pressableStyles: ViewStyle = {
    flexDirection: 'row',
  }

  return (
    <Box {...boxProps}>
      <Pressable
        style={pressableStyles}
        onPress={() => Linking.openURL(`https://${link}`)}
        accessible={true}
        accessibilityRole={'button'}
        testID={title}>
        {/* Continue here */}
        <Box />
      </Pressable>
    </Box>
  )
}

export default AnnouncementBanner

import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, PressableStateCallbackType, ViewStyle } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon'
import { colors } from '@department-of-veterans-affairs/mobile-tokens'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useExternalLink, useRouteNavigation, useTheme } from 'utils/hooks'

interface AnnouncementBannerProps {
  /** Text for announcement title */
  title: string
  /** External link used */
  link: string
  /** Optional accessibilityLabel */
  a11yLabel?: string
  /** Determines whether to use the WebView for opening link. Defaults to launching link externally. */
  useWebView?: boolean
  /** Message to display when loading WebView. `useWebView` must be enabled to take effect. */
  webViewLoadingMessage?: string
}

const AnnouncementBanner: FC<AnnouncementBannerProps> = ({
  title,
  link,
  a11yLabel,
  useWebView,
  webViewLoadingMessage,
}: AnnouncementBannerProps) => {
  const theme = useTheme()
  const launchExternalLink = useExternalLink()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)

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
    <Pressable
      style={pressableStyle}
      onPress={() =>
        useWebView
          ? navigateTo('Webview', {
              url: link,
              displayTitle: t('webview.vagov'),
              loadingMessage: webViewLoadingMessage || t('webview.default.loading'),
              useSSO: true,
            })
          : launchExternalLink(link)
      }
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

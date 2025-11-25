import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityInfo, Pressable } from 'react-native'
import { useSelector } from 'react-redux'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { OfflineState } from 'store/slices'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'
import { CONNECTION_STATUS, useAppIsOnline } from 'utils/hooks/offline'

const OfflineBannerTimestamp: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { offlineTimestamp } = useSelector<RootState, OfflineState>((state) => state.offline)

  useEffect(() => {
    AccessibilityInfo.announceForAccessibilityWithOptions(
      `${t('offline.lastConnected')} ${getFormattedDateAndTimeZone(offlineTimestamp?.toISO() || '')}`,
      { queue: true },
    )
  }, [offlineTimestamp, t])

  return (
    <Box pb={theme.dimensions.condensedMarginBetween}>
      <TextView color="offlineText" variant="HelperText">
        {t('offline.lastConnected')} {getFormattedDateAndTimeZone(offlineTimestamp?.toISO() || '')}
      </TextView>
    </Box>
  )
}

export const OfflineBanner: FC = () => {
  const connectionStatus = useAppIsOnline()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [bannerExpanded, setBannerExpanded] = useState(false)
  // This is used to trigger the screen reader announcement for the screen disconnection occurs

  const onBannerInteract = () => {
    setBannerExpanded(!bannerExpanded)
  }

  // If we are online, show nothing
  if (connectionStatus === CONNECTION_STATUS.CONNECTED) {
    return null
  }

  return (
    <Box
      backgroundColor="offlineBanner"
      px={theme.dimensions.gutter}
      pt={theme.dimensions.tinyMarginBetween}
      mb={theme.dimensions.condensedMarginBetween}>
      <Pressable
        accessibilityState={{ expanded: bannerExpanded }}
        onPress={onBannerInteract}
        accessibilityRole="button">
        <Box height={40} display="flex" flexDirection="row" justifyContent="space-between">
          <TextView color="offlineText" variant="MobileBodyBold">
            {t('offline.banner.title')}
          </TextView>
          <Icon
            name={bannerExpanded ? 'ExpandLess' : 'ExpandMore'}
            fill={theme.colors.icon.contrast}
            width={theme.dimensions.chevronListItemWidth}
            height={theme.dimensions.chevronListItemHeight}
          />
        </Box>
      </Pressable>
      {bannerExpanded && <OfflineBannerTimestamp />}
    </Box>
  )
}

export default OfflineBanner

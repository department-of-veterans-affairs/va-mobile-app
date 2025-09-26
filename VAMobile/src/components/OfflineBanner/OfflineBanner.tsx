import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'
import { useSelector } from 'react-redux'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'
import { DateTime } from 'luxon'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { OfflineState, setBannerExpanded, setOfflineTimestamp } from 'store/slices'
import { getFormattedDateAndTimeZone } from 'utils/formattingUtils'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { useOfflineMode } from 'utils/hooks/offline'

export const OfflineBanner: FC = () => {
  const isConnected = useOfflineMode()
  // const [expanded, setExpanded] = useState<boolean>(false)
  // const [offlineTimestamp, setOfflineTimestamp] = useState<DateTime>()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { offlineTimestamp, bannerExpanded } = useSelector<RootState, OfflineState>((state) => state.offline)
  console.log(`OOOOOOOOO ${isConnected} OOOOOOOO`)
  useEffect(() => {
    if (!isConnected && !offlineTimestamp) {
      dispatch(setOfflineTimestamp(DateTime.local()))
    } else if (isConnected) {
      dispatch(setOfflineTimestamp(undefined))
    }
  }, [isConnected, offlineTimestamp, dispatch])

  const onBannerInteract = () => {
    dispatch(setBannerExpanded(!bannerExpanded))
  }

  // If we are online, show nothing
  if (isConnected) {
    return null
  }

  return (
    <Box
      backgroundColor={'offlineBanner'}
      px={theme.dimensions.gutter}
      pt={5}
      mb={theme.dimensions.condensedMarginBetween}>
      <Pressable onPress={onBannerInteract} accessibilityRole={'button'}>
        <Box height={40} display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
          <TextView color={'primaryContrast'} variant={'MobileBodyBold'}>
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
      {bannerExpanded && (
        <Box pb={theme.dimensions.condensedMarginBetween}>
          <TextView color={'primaryContrast'} variant={'HelperText'}>
            {t('offline.lastConnected')} {getFormattedDateAndTimeZone(offlineTimestamp?.toISO() || '')}
          </TextView>
        </Box>
      )}
    </Box>
  )
}

export default OfflineBanner

import React, { FC, useEffect } from 'react'

import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { Box, CrisisLineCta, FocusedNavHeaderText, LargeNavButton, VAScrollView } from 'components'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { HealthStackParamList } from './HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { getInbox, logCOVIDClickAnalytics } from 'store/actions'
import { getInboxUnreadCount } from './SecureMessaging/SecureMessaging'
import { testIdProps } from 'utils/accessibility'
import { useDispatch, useSelector } from 'react-redux'
import { useDowntime, useHasCernerFacilities, useHeaderStyles, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import CernerAlert from './CernerAlert'
import getEnv from 'utils/env'

const { WEBVIEW_URL_CORONA_FAQ } = getEnv()

type HealthScreenProps = StackScreenProps<HealthStackParamList, 'Health'>

export const HealthScreen: FC<HealthScreenProps> = ({ navigation }) => {
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const t = useTranslation(NAMESPACE.HEALTH)
  const dispatch = useDispatch()

  const unreadCount = useSelector<StoreState, number>(getInboxUnreadCount)
  const hasCernerFacilities = useHasCernerFacilities()

  const onCrisisLine = navigateTo('VeteransCrisisLine')
  const onAppointments = navigateTo('Appointments')
  const onSecureMessaging = navigateTo('SecureMessaging')
  const onVaVaccines = navigateTo('VaccineList')
  const onCoronaVirusFAQ = () => {
    dispatch(logCOVIDClickAnalytics('health_screen'))
    navigation.navigate('Webview', { url: WEBVIEW_URL_CORONA_FAQ, displayTitle: t('common:webview.vagov') })
  }
  const smNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.secureMessaging)

  useEffect(() => {
    if (smNotInDowntime) {
      // fetch inbox metadata to display unread messages count tag
      dispatch(getInbox(ScreenIDTypesConstants.HEALTH_SCREEN_ID))
    }
  }, [dispatch, smNotInDowntime])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (headerTitle) => <FocusedNavHeaderText headerTitle={headerTitle.children} />,
    })
  }, [navigation])

  return (
    <VAScrollView {...testIdProps('Health-care-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mb={!hasCernerFacilities ? theme.dimensions.contentMarginBottom : theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        <LargeNavButton
          title={t('appointments.title')}
          subText={t('appointments.subText')}
          a11yHint={t('appointments.a11yHint')}
          onPress={onAppointments}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
        <LargeNavButton
          title={t('secureMessaging.title')}
          subText={t('secureMessaging.subText')}
          a11yHint={t('secureMessaging.a11yHint')}
          onPress={onSecureMessaging}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
          tagCount={unreadCount}
          tagCountA11y={t('secureMessaging.tag.a11y', { unreadCount })}
        />
        <LargeNavButton
          title={t('vaVaccines.buttonTitle')}
          subText={t('vaVaccines.subText')}
          a11yHint={t('vaVaccines.a11yHint')}
          onPress={onVaVaccines}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
        <LargeNavButton
          title={t('covid19Updates.title')}
          subText={t('covid19Updates.subText')}
          a11yHint={t('covid19Updates.a11yHint')}
          onPress={onCoronaVirusFAQ}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
      </Box>
      <Box mb={hasCernerFacilities ? theme.dimensions.contentMarginBottom : 0}>
        <CernerAlert />
      </Box>
    </VAScrollView>
  )
}

type HealthStackScreenProps = Record<string, unknown>

const HealthScreenStack = createStackNavigator()

/**
 * Stack screen for the Health tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
const HealthStackScreen: FC<HealthStackScreenProps> = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const headerStyles = useHeaderStyles()

  return (
    <HealthScreenStack.Navigator screenOptions={headerStyles}>
      <HealthScreenStack.Screen name="Health" component={HealthScreen} options={{ title: t('page.title') }} />
    </HealthScreenStack.Navigator>
  )
}

export default HealthStackScreen

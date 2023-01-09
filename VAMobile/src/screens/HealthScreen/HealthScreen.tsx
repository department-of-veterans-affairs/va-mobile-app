import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, CrisisLineCta, FocusedNavHeaderText, LargeNavButton, VAScrollView } from 'components'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { HealthStackParamList } from './HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionState, loadAllPrescriptions } from 'store/slices'
import { RootState } from 'store'
import { featureEnabled } from 'utils/remoteConfig'
import { getInbox } from 'store/slices/secureMessagingSlice'
import { getInboxUnreadCount } from './SecureMessaging/SecureMessaging'
import { logCOVIDClickAnalytics } from 'store/slices/vaccineSlice'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDowntime, useHasCernerFacilities, useHeaderStyles, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import CernerAlert from './CernerAlert'
import getEnv from 'utils/env'

const { WEBVIEW_URL_CORONA_FAQ } = getEnv()

type HealthScreenProps = StackScreenProps<HealthStackParamList, 'Health'>

export const HealthScreen: FC<HealthScreenProps> = ({ navigation }) => {
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const { t: th } = useTranslation(NAMESPACE.HOME)
  const dispatch = useAppDispatch()

  const unreadCount = useSelector<RootState, number>(getInboxUnreadCount)
  const hasCernerFacilities = useHasCernerFacilities()
  const { prescriptionsNeedLoad } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)

  const onCrisisLine = navigateTo('VeteransCrisisLine')
  const onAppointments = navigateTo('Appointments')
  const onSecureMessaging = navigateTo('SecureMessaging')
  const onVaVaccines = navigateTo('VaccineList')
  const pharmacyNavHandler = navigateTo('PrescriptionHistory')
  const onPharmacy = () => {
    // If rx list is already loaded, reload it to ensure freshness
    if (!prescriptionsNeedLoad) {
      dispatch(loadAllPrescriptions(ScreenIDTypesConstants.HEALTH_SCREEN_ID))
    }
    pharmacyNavHandler()
  }
  const onCoronaVirusFAQ = () => {
    dispatch(logCOVIDClickAnalytics('health_screen'))
    navigation.navigate('Webview', { url: WEBVIEW_URL_CORONA_FAQ, displayTitle: tc('webview.vagov'), loadingMessage: th('webview.covidUpdates.loading') })
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
        {featureEnabled('prescriptions') && (
          <LargeNavButton
            title={t('prescription.title')}
            subText={t('prescription.subText')}
            subTextA11yLabel={t('prescription.subText.a11yLabel')}
            a11yHint={t('prescription.A11yHint')}
            onPress={onPharmacy}
            borderWidth={theme.dimensions.buttonBorderWidth}
            borderColor={'secondary'}
            borderColorActive={'primaryDarkest'}
            borderStyle={'solid'}
          />
        )}
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
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const headerStyles = useHeaderStyles()

  return (
    <HealthScreenStack.Navigator screenOptions={headerStyles}>
      <HealthScreenStack.Screen name="Health" component={HealthScreen} options={{ title: t('page.title') }} />
    </HealthScreenStack.Navigator>
  )
}

export default HealthStackScreen

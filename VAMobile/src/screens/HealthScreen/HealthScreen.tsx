import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import React, { FC, useEffect } from 'react'

import { Box, CrisisLineCta, FocusedNavHeaderText, LargeNavButton, LoadingComponent, VAScrollView } from 'components'
import { HealthStackParamList } from './HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { getInbox } from 'store/slices/secureMessagingSlice'
import { getInboxUnreadCount } from './SecureMessaging/SecureMessaging'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useAppSelector, useHasCernerFacilities, useHeaderStyles, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import CernerAlert from './CernerAlert'

type HealthScreenProps = StackScreenProps<HealthStackParamList, 'Health'>

const HealthScreen: FC<HealthScreenProps> = ({ navigation }) => {
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const t = useTranslation(NAMESPACE.HEALTH)
  const dispatch = useAppDispatch()

  const { hasLoadedInbox } = useAppSelector((state) => state.secureMessaging)
  const unreadCount = useAppSelector(getInboxUnreadCount)
  const hasCernerFacilities = useHasCernerFacilities()

  const onCrisisLine = navigateTo('VeteransCrisisLine')
  const onAppointments = navigateTo('Appointments')
  const onSecureMessaging = navigateTo('SecureMessaging')

  useEffect(() => {
    // fetch inbox metadata to display unread messages count tag
    dispatch(getInbox(ScreenIDTypesConstants.HEALTH_SCREEN_ID))
  }, [dispatch])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (headerTitle) => <FocusedNavHeaderText headerTitle={headerTitle.children} />,
    })
  }, [navigation])

  if (!hasLoadedInbox) {
    return <LoadingComponent text={t('healthScreen.loading')} />
  }

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

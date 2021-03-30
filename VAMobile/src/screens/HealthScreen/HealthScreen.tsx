import React, { FC } from 'react'

import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { Box, CrisisLineCta, LargeNavButton, VAScrollView } from 'components'
import { HealthStackParamList } from './HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type HealthScreenProps = StackScreenProps<HealthStackParamList, 'Health'>

const HealthScreen: FC<HealthScreenProps> = () => {
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const t = useTranslation(NAMESPACE.HEALTH)

  const onCrisisLine = navigateTo('VeteransCrisisLine')
  const onAppointments = navigateTo('Appointments')
  const onSecureMessaging = navigateTo('SecureMessaging')

  return (
    <VAScrollView {...testIdProps('Health-care-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
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
        />
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
      <HealthScreenStack.Screen name="Health" component={HealthScreen} options={{ title: t('title') }} />
    </HealthScreenStack.Navigator>
  )
}

export default HealthStackScreen

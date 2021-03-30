import { Linking } from 'react-native'

import { Box, TextLinesList, TextListItemObj, VAScrollView } from 'components'
import { CrisisLineCta, LargeNavButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { createStackNavigator } from '@react-navigation/stack'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import React, { FC } from 'react'
import getEnv from 'utils/env'

const { WEBVIEW_URL_CORONA_FAQ, WEBVIEW_URL_FACILITY_LOCATOR, LINK_URL_COVID19_SCREENING } = getEnv()

type HomeScreenProps = Record<string, unknown>

const HomeScreen: FC<HomeScreenProps> = () => {
  const t = useTranslation(NAMESPACE.HOME)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()

  const onScreeningTool = (): void => {
    Linking.openURL(LINK_URL_COVID19_SCREENING)
  }

  const onClaimsAndAppeals = navigateTo('Claims')
  const onAppointments = navigateTo('Health')
  const onSecureMessaging = navigateTo('SecureMessaging')
  const onContactVA = navigateTo('ContactVA')
  const onFacilityLocator = navigateTo('Webview', { url: WEBVIEW_URL_FACILITY_LOCATOR, displayTitle: t('common:webview.vagov') })
  const onCoronaVirusFAQ = navigateTo('Webview', { url: WEBVIEW_URL_CORONA_FAQ, displayTitle: t('common:webview.vagov') })
  const onCrisisLine = navigateTo('VeteransCrisisLine')
  const onLetters = navigateTo('LettersOverview')

  const buttonDataList: Array<TextListItemObj> = [
    {
      textLines: t('findLocation.title'),
      a11yHintText: t('findLocation.a11yHint'),
      onPress: onFacilityLocator,
      testId: t('findLocation.titleA11yLabel'),
    },
    { textLines: t('contactVA.title'), a11yHintText: t('contactVA.a11yHint'), onPress: onContactVA, testId: t('contactVA.title.a11yLabel') },
    { textLines: t('coronavirusFaqs.title'), a11yHintText: t('coronavirusFaqs.a11yHint'), onPress: onCoronaVirusFAQ },
    { textLines: t('screeningTool.title'), a11yHintText: t('screeningTool.a11yHint'), onPress: onScreeningTool },
  ]

  return (
    <VAScrollView {...testIdProps('Home-page')} accessibilityRole={'menu'}>
      <Box flex={1} justifyContent="flex-start">
        <CrisisLineCta onPress={onCrisisLine} />
        <Box mx={theme.dimensions.gutter}>
          <LargeNavButton
            title={t('covid19Vaccinations.covid19Vaccines')}
            subText={t('covid19Vaccinations.stayInformedAndHelpUsPrepare')}
            a11yHint={t('covid19Vaccinations.a11yHint')}
            onPress={navigateTo('Covid19VaccinationsForm')}
            backgroundColor={'covid19Vaccinations'}
            backgroundColorActive={'covid19VaccinationsActive'}
            textColor={'covid19Vaccinations'}
            iconColor={'covid19Vaccinations'}
          />
          <LargeNavButton
            title={t('claimsAndAppeals.title')}
            subText={t('claimsAndAppeals.subText')}
            a11yHint={t('covid19Vaccinations.a11yHint')}
            onPress={onClaimsAndAppeals}
            borderWidth={theme.dimensions.buttonBorderWidth}
            borderColor={'secondary'}
            borderColorActive={'primaryDarkest'}
            borderStyle={'solid'}
          />
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
          <LargeNavButton
            title={t('letters.title')}
            subText={t('letters.subText')}
            a11yHint={t('letters.a11yHint')}
            onPress={onLetters}
            borderWidth={theme.dimensions.buttonBorderWidth}
            borderColor={'secondary'}
            borderColorActive={'primaryDarkest'}
            borderStyle={'solid'}
          />
        </Box>
        <Box my={theme.dimensions.contentMarginBottom}>
          <TextLinesList items={buttonDataList} />
        </Box>
      </Box>
    </VAScrollView>
  )
}

type HomeStackScreenProps = Record<string, unknown>

const HomeScreenStack = createStackNavigator()

/**
 * Stack screen for the Home tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
const HomeStackScreen: FC<HomeStackScreenProps> = () => {
  const t = useTranslation(NAMESPACE.HOME)
  const headerStyles = useHeaderStyles()

  return (
    <HomeScreenStack.Navigator screenOptions={headerStyles}>
      <HomeScreenStack.Screen name="Home" component={HomeScreen} options={{ title: t('title') }} />
    </HomeScreenStack.Navigator>
  )
}

export default HomeStackScreen

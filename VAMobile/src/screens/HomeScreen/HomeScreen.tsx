import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, FocusedNavHeaderText, SimpleList, SimpleListItemObj, TextView, VAScrollView } from 'components'
import { CrisisLineCta, LargeNavButton } from 'components'
import { DateTime } from 'luxon'
import { HomeStackParamList } from './HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, getProfileInfo } from 'store/slices/personalInformationSlice'
import { RootState } from 'store'
import { ScreenIDTypesConstants, UserGreetingTimeConstants } from 'store/api/types'
import { createStackNavigator } from '@react-navigation/stack'
import { logCOVIDClickAnalytics } from 'store/slices/vaccineSlice'
import { stringToTitleCase } from 'utils/formattingUtils'
import { useAppDispatch, useHeaderStyles, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import getEnv from 'utils/env'

const { WEBVIEW_URL_CORONA_FAQ, WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>

export const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()

  const { t } = useTranslation(NAMESPACE.HOME)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)

  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const { profile } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)
  const name = profile?.fullName || ''

  useEffect(() => {
    // Fetch the profile information
    if (name === '') {
      dispatch(getProfileInfo(ScreenIDTypesConstants.PROFILE_SCREEN_ID))
    }
  }, [dispatch, name])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (headerTitle) => <FocusedNavHeaderText headerTitle={headerTitle.children} />,
    })
  }, [navigation])

  const onClaimsAndAppeals = navigateTo('ClaimsTab')
  const onContactVA = navigateTo('ContactVA')
  const onFacilityLocator = navigateTo('Webview', { url: WEBVIEW_URL_FACILITY_LOCATOR, displayTitle: tc('webview.vagov'), loadingMessage: t('webview.valocation.loading') })
  const onCoronaVirusFAQ = () => {
    dispatch(logCOVIDClickAnalytics('home_screen'))
    navigation.navigate('Webview', { url: WEBVIEW_URL_CORONA_FAQ, displayTitle: tc('webview.vagov'), loadingMessage: t('webview.covidUpdates.loading') })
  }
  const onCrisisLine = navigateTo('VeteransCrisisLine')
  const onLetters = navigateTo('LettersOverview')
  const onHealthCare = navigateTo('HealthTab')
  const onPayments = navigateTo('Payments')

  const buttonDataList: Array<SimpleListItemObj> = [
    {
      text: t('findLocation.title'),
      a11yHintText: t('findLocation.a11yHint'),
      onPress: onFacilityLocator,
      testId: t('findLocation.titleA11yLabel'),
    },
    { text: t('contactVA.title'), a11yHintText: t('contactVA.a11yHint'), onPress: onContactVA, testId: t('contactVA.title.a11yLabel') },
    { text: t('coronavirusFaqs.title'), a11yHintText: t('coronavirusFaqs.a11yHint'), onPress: onCoronaVirusFAQ, testId: t('coronavirusFaqs.title') },
  ]

  let greeting
  const currentHour = DateTime.now().toObject()?.hour
  if (currentHour === undefined) {
    greeting = null
  } else if (currentHour < UserGreetingTimeConstants.EVENING) {
    greeting = t('greetings.evening')
  } else if (currentHour < UserGreetingTimeConstants.MORNING) {
    greeting = t('greetings.morning')
  } else if (currentHour < UserGreetingTimeConstants.AFTERNOON) {
    greeting = t('greetings.afternoon')
  } else {
    greeting = t('greetings.evening')
  }
  const heading = `${greeting}${name ? `, ${stringToTitleCase(name)}` : ''}`

  return (
    <VAScrollView>
      <Box flex={1} justifyContent="flex-start">
        <CrisisLineCta onPress={onCrisisLine} />
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.cardPadding}>
          <TextView variant={'MobileBodyBold'} accessibilityRole={'header'}>
            {heading}
          </TextView>
        </Box>
        <Box mx={theme.dimensions.gutter}>
          <LargeNavButton
            title={t('claimsAndAppeals.title')}
            subText={t('claimsAndAppeals.subText')}
            onPress={onClaimsAndAppeals}
            borderWidth={theme.dimensions.buttonBorderWidth}
            borderColor={'secondary'}
            borderColorActive={'primaryDarkest'}
            borderStyle={'solid'}
          />
          <LargeNavButton
            title={t('healthCare.title')}
            subText={t('healthCare.subText')}
            onPress={onHealthCare}
            borderWidth={theme.dimensions.buttonBorderWidth}
            borderColor={'secondary'}
            borderColorActive={'primaryDarkest'}
            borderStyle={'solid'}
          />
          <LargeNavButton
            title={t('letters.title')}
            subText={t('letters.subText')}
            onPress={onLetters}
            borderWidth={theme.dimensions.buttonBorderWidth}
            borderColor={'secondary'}
            borderColorActive={'primaryDarkest'}
            borderStyle={'solid'}
          />
          <LargeNavButton
            title={t('payments.title')}
            subText={t('payments.subText')}
            onPress={onPayments}
            borderWidth={theme.dimensions.buttonBorderWidth}
            borderColor={'secondary'}
            borderColorActive={'primaryDarkest'}
            borderStyle={'solid'}
          />
        </Box>
        <Box my={theme.dimensions.contentMarginBottom}>
          <SimpleList items={buttonDataList} />
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
  const { t } = useTranslation(NAMESPACE.HOME)
  const headerStyles = useHeaderStyles()

  return (
    <HomeScreenStack.Navigator screenOptions={headerStyles}>
      <HomeScreenStack.Screen name="Home" component={HomeScreen} options={{ title: t('title') }} />
    </HomeScreenStack.Navigator>
  )
}

export default HomeStackScreen

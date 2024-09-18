import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StatusBar, StyleProp, ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { AlertWithHaptics, Box, CrisisLineButton, VALogo, VAScrollView, WaygateWrapper } from 'components'
import AppVersionAndBuild from 'components/AppVersionAndBuild'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { AuthParamsLoadingStateTypeConstants } from 'store/api/types/auth'
import { AuthState, FIRST_TIME_LOGIN, NEW_SESSION, loginStart, setPKCEParams } from 'store/slices/authSlice'
import { DemoState, updateDemoMode } from 'store/slices/demoSlice'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from 'utils/analytics'
import getEnv from 'utils/env'
import { useAppDispatch, useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'
import { useStartAuth } from 'utils/hooks/auth'

import DemoAlert from './DemoAlert'

function LoginScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { firstTimeLogin } = useSelector<RootState, AuthState>((state) => state.auth)
  const { authParamsLoadingState } = useSelector<RootState, AuthState>((state) => state.auth)

  const dispatch = useAppDispatch()
  const isPortrait = useOrientation()
  const navigateTo = useRouteNavigation()
  const startAuth = useStartAuth()
  const theme = useTheme()
  const [demoPromptVisible, setDemoPromptVisible] = useState(false)
  const TAPS_FOR_DEMO = 7
  let demoTaps = 0

  useEffect(() => {
    if (authParamsLoadingState === AuthParamsLoadingStateTypeConstants.INIT) {
      dispatch(setPKCEParams())
    }
  }, [authParamsLoadingState, dispatch])

  const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

  const mainViewStyle: StyleProp<ViewStyle> = {
    flexGrow: 1,
    backgroundColor: theme.colors.background.loginScreen,
  }

  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)

  const onFacilityLocator = () => {
    logAnalyticsEvent(Events.vama_find_location())
    navigateTo('Webview', {
      url: WEBVIEW_URL_FACILITY_LOCATOR,
      displayTitle: t('webview.vagov'),
      loadingMessage: t('webview.valocation.loading'),
    })
  }

  const handleUpdateDemoMode = () => {
    dispatch(updateDemoMode(true))
  }
  const tapForDemo = () => {
    demoTaps++
    console.log(`demotaps: ${demoTaps}`)
    if (demoTaps >= TAPS_FOR_DEMO) {
      demoTaps = 0
      setDemoPromptVisible(true)
    }
  }

  async function setFirstTimeLogin() {
    await AsyncStorage.setItem(FIRST_TIME_LOGIN, 'true')
  }
  async function setNewSession() {
    await AsyncStorage.setItem(NEW_SESSION, 'true')
  }

  // const onLoginInit = demoMode
  //   ? () => {
  //       setNewSession()
  //       dispatch(loginStart(true))
  //     }
  //   : firstTimeLogin
  //     ? () => {
  //         setFirstTimeLogin()
  //         setNewSession()

  //         navigateTo('LoaGate')
  //       }
  //     : () => {
  //         setNewSession()
  //         startAuth()
  //       }

  const onLoginInit = () => {
    logNonFatalErrorToFirebase(
      { status: 404, endpoint: '/v0/appointments', text: 'Test', json: { error: 'fail' } },
      'Test crash error',
    )
  }

  return (
    <VAScrollView testID="Login-page" contentContainerStyle={mainViewStyle} removeInsets={true}>
      <StatusBar
        translucent
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background.main}
      />
      <DemoAlert visible={demoPromptVisible} setVisible={setDemoPromptVisible} onConfirm={handleUpdateDemoMode} />
      <CrisisLineButton />
      {demoMode && <AlertWithHaptics variant="info" header="DEMO MODE" />}
      <WaygateWrapper waygateName="WG_Login" />
      <Box
        flex={1}
        mt={theme.dimensions.contentMarginTop}
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <Box
          alignItems={'center'}
          flex={1}
          justifyContent={'center'}
          onTouchEnd={tapForDemo}
          my={theme.dimensions.standardMarginBetween}
          testID="va-icon"
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel={t('demoMode.imageDescription')}>
          <VALogo testID="VALogo" />
        </Box>
        <Box mx={theme.dimensions.gutter} my={theme.dimensions.standardMarginBetween}>
          <Button onPress={onLoginInit} label={t('signin')} />
        </Box>
        <Box mx={theme.dimensions.gutter} mb={70}>
          <Button
            onPress={onFacilityLocator}
            label={t('findLocation.title')}
            a11yLabel={a11yLabelVA(t('findLocation.title'))}
            buttonType={ButtonVariants.Secondary}
          />
        </Box>
        <AppVersionAndBuild textColor={'appVersionAndBuild'} />
      </Box>
    </VAScrollView>
  )
}

export default LoginScreen

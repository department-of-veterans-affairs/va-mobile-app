import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleProp, ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { AlertBox, Box, BoxProps, CrisisLineCta, VAScrollView, WaygateWrapper } from 'components'
import AppVersionAndBuild from 'components/AppVersionAndBuild'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { AuthParamsLoadingStateTypeConstants } from 'store/api/types/auth'
import { AuthState, loginStart, setPKCEParams } from 'store/slices/authSlice'
import { DemoState, updateDemoMode } from 'store/slices/demoSlice'
import { testIdProps } from 'utils/accessibility'
import { logAnalyticsEvent } from 'utils/analytics'
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

  const onCrisisLine = () => {
    navigateTo('VeteransCrisisLine')
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

  const onLoginInit = demoMode
    ? () => {
        dispatch(loginStart(true))
      }
    : firstTimeLogin
      ? () => {
          navigateTo('LoaGate')
        }
      : startAuth

  return (
    <VAScrollView {...testIdProps('Login-page', true)} contentContainerStyle={mainViewStyle} removeInsets={true}>
      <DemoAlert visible={demoPromptVisible} setVisible={setDemoPromptVisible} onConfirm={handleUpdateDemoMode} />
      <CrisisLineCta onPress={onCrisisLine} />
      {demoMode && <AlertBox border={'informational'} title={'DEMO MODE'} />}
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
          testID="va-icon">
          <Image
            style={{ width: 254, height: 57 }}
            source={
              theme.mode === 'dark'
                ? require('../../../../node_modules/@department-of-veterans-affairs/mobile-assets/VALogo/VAOnDark.png')
                : require('../../../../node_modules/@department-of-veterans-affairs/mobile-assets/VALogo/VAOnLight.png')
            }
          />
        </Box>
        <Box mx={theme.dimensions.gutter} my={theme.dimensions.standardMarginBetween}>
          <Button onPress={onLoginInit} label={t('signin')} />
        </Box>
        <Box mx={theme.dimensions.gutter} mb={70}>
          <Button onPress={onFacilityLocator} label={t('findLocation.title')} buttonType={ButtonVariants.Secondary} />
        </Box>
        <AppVersionAndBuild textColor={'appVersionAndBuild'} />
      </Box>
    </VAScrollView>
  )
}

export default LoginScreen

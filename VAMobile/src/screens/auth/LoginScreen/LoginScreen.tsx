import { Pressable, StyleProp, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AlertBox, Box, BoxProps, ButtonTypesConstants, CrisisLineCta, TextView, VAButton, VAIcon, VAScrollView } from 'components'
import { AuthState, loginStart } from 'store/slices/authSlice'
import { DemoState, updateDemoMode } from 'store/slices/demoSlice'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { a11yLabelVA } from 'utils/a11yLabel'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import AppVersionAndBuild from 'components/AppVersionAndBuild'
import DemoAlert from './DemoAlert'
import getEnv from 'utils/env'

const LoginScreen: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { firstTimeLogin } = useSelector<RootState, AuthState>((state) => state.auth)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const [demoPromptVisible, setDemoPromptVisible] = useState(false)
  const TAPS_FOR_DEMO = 20
  let demoTaps = 0

  const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

  const mainViewStyle: StyleProp<ViewStyle> = {
    flexGrow: 1,
    backgroundColor: theme.colors.background.splashScreen,
  }

  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)

  const onFacilityLocator = navigateTo('Webview', {
    url: WEBVIEW_URL_FACILITY_LOCATOR,
    displayTitle: t('webview.vagov'),
    loadingMessage: t('webview.valocation.loading'),
  })
  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const findLocationProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: theme.dimensions.touchableMinHeight,
    mt: theme.dimensions.standardMarginBetween,
    py: theme.dimensions.buttonPadding,
    testID: 'findVALocationTestID',
  }

  const dispatch = useAppDispatch()
  const handleUpdateDemoMode = () => {
    dispatch(updateDemoMode(true))
  }
  const tapForDemo = () => {
    demoTaps++
    console.log(`demotaps: ${demoTaps}`)
    if (demoTaps > TAPS_FOR_DEMO) {
      demoTaps = 0
      setDemoPromptVisible(true)
    }
  }

  const onLoginInit = demoMode
    ? () => {
        dispatch(loginStart(true))
      }
    : firstTimeLogin
    ? navigateTo('LoaGate')
    : navigateTo('WebviewLogin')

  return (
    <VAScrollView {...testIdProps('Login-page', true)} contentContainerStyle={mainViewStyle}>
      <DemoAlert visible={demoPromptVisible} setVisible={setDemoPromptVisible} onConfirm={handleUpdateDemoMode} />
      <CrisisLineCta onPress={onCrisisLine} />
      {demoMode && <AlertBox border={'informational'} title={'DEMO MODE'} />}
      <Box flex={1}>
        <Box alignItems={'center'} flex={1} justifyContent={'center'} onTouchEnd={tapForDemo} my={theme.dimensions.standardMarginBetween} testID="va-icon">
          <VAIcon testID="VAIcon" name={'Logo'} />
        </Box>
        <Box mx={theme.dimensions.gutter} mb={80}>
          <VAButton onPress={onLoginInit} label={t('signin')} a11yHint={t('signin.a11yHint')} buttonType={ButtonTypesConstants.buttonWhite} hideBorder={true} />
          <Pressable
            onPress={onFacilityLocator}
            {...testIdProps(a11yLabelVA(t('findLocation.title')))}
            accessibilityHint={a11yLabelVA(t('findLocation.a11yHint'))}
            accessibilityRole="button">
            <Box {...findLocationProps}>
              <TextView variant={'MobileBodyBold'} display="flex" flexDirection="row" color="primaryContrast" mr={theme.dimensions.textIconMargin}>
                {t('findLocation.title')}
              </TextView>
              <VAIcon name="ChevronRight" fill="#FFF" width={10} height={15} />
            </Box>
          </Pressable>
        </Box>
        <AppVersionAndBuild textColor={'primaryContrast'} />
      </Box>
    </VAScrollView>
  )
}

export default LoginScreen

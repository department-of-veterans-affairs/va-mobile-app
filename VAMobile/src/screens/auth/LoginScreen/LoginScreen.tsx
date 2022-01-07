import { Pressable, StyleProp, ViewStyle } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useState } from 'react'

import { AlertBox, Box, BoxProps, ButtonTypesConstants, CrisisLineCta, TextView, VAButton, VAIcon, VAScrollView } from 'components'
import { AuthState, DemoState, StoreState, loginStart, updateDemoMode } from 'store'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import AppVersionAndBuild from 'components/AppVersionAndBuild'
import DemoAlert from './DemoAlert'
import getEnv from 'utils/env'

const LoginScreen: FC = () => {
  const t = useTranslation(NAMESPACE.LOGIN)
  const { firstTimeLogin } = useSelector<StoreState, AuthState>((s) => s.auth)
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

  const { demoMode } = useSelector<StoreState, DemoState>((state) => state.demo)

  const onFacilityLocator = navigateTo('Webview', {
    url: WEBVIEW_URL_FACILITY_LOCATOR,
    displayTitle: t('common:webview.vagov'),
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
  }

  const dispatch = useDispatch()
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
      {demoMode && (
        <Box mx={theme.dimensions.gutter}>
          <AlertBox border={'informational'} title={'DEMO MODE'} />
        </Box>
      )}
      <Box mx={theme.dimensions.gutter}>
        <AlertBox border={'informational'} title={'Dark Mode version, not for regular QA'} />
      </Box>
      <Box flex={1}>
        <Box alignItems={'center'} flex={1} justifyContent={'center'} onTouchEnd={tapForDemo} my={theme.dimensions.standardMarginBetween}>
          <VAIcon name={'Logo'} />
        </Box>
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.loginContentMarginBottom}>
          <VAButton
            onPress={onLoginInit}
            label={t('login:signin')}
            testID={t('login:signin')}
            a11yHint={t('login:signin.a11yHint')}
            buttonType={ButtonTypesConstants.buttonWhite}
            hideBorder={true}
          />
          <Pressable
            onPress={onFacilityLocator}
            {...testIdProps(t('home:findLocation.titleA11yLabel'))}
            accessibilityHint={t('home:findLocation.a11yHint')}
            accessibilityRole="button">
            <Box {...findLocationProps}>
              <TextView variant={'MobileBodyBold'} display="flex" flexDirection="row" color="primaryContrast" mr={theme.dimensions.textIconMargin}>
                {t('home:findLocation.title')}
              </TextView>
              <VAIcon name="ArrowRight" fill="#FFF" width={10} height={15} />
            </Box>
          </Pressable>
        </Box>
        <AppVersionAndBuild textColor={'primaryContrast'} />
      </Box>
    </VAScrollView>
  )
}

export default LoginScreen

import { Pressable, StyleProp, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { AlertBox, Box, BoxProps, ButtonTypesConstants, CrisisLineCta, TextView, VAButton, VAIcon, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { demoAlert } from 'utils/demoAlert'
import { loginStart } from 'store/slices/authSlice'
import { testIdProps } from 'utils/accessibility'
import { updateDemoMode } from 'store/slices/demoSlice'
import { useAppDispatch, useAppSelector, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import AppVersionAndBuild from 'components/AppVersionAndBuild'
import getEnv from 'utils/env'

const LoginScreen: FC = () => {
  const t = useTranslation(NAMESPACE.LOGIN)
  const { firstTimeLogin } = useAppSelector((state) => state.auth)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const TAPS_FOR_DEMO = 20
  let demoTaps = 0

  const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

  const mainViewStyle: StyleProp<ViewStyle> = {
    flexGrow: 1,
    backgroundColor: theme.colors.background.splashScreen,
  }

  const { demoMode } = useAppSelector((state) => state.demo)

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

  const dispatch = useAppDispatch()
  const tapForDemo = () => {
    demoTaps++
    if (demoTaps > TAPS_FOR_DEMO) {
      demoTaps = 0
      demoAlert(() => {
        dispatch(updateDemoMode(true))
      })
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
      <CrisisLineCta onPress={onCrisisLine} />
      {demoMode && (
        <Box mx={theme.dimensions.gutter}>
          <AlertBox border={'informational'} background={'cardBackground'} title={'DEMO MODE'} />
        </Box>
      )}
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

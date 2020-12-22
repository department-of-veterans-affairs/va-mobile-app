import { ActivityIndicator, Button, Pressable, StyleProp, View, ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement } from 'react'

import { AuthState, StoreState, cancelWebLogin, startWebLogin } from 'store'
import { Box, BoxProps, CrisisLineCta, CtaButton, VAButton, VAIcon } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { TextView } from 'components'
import { isIOS } from 'utils/platform'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

import { useRouteNavigation } from 'utils/hooks'
import getEnv from 'utils/env'

const LoginScreen: FC = () => {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.LOGIN)
  const { webLoginUrl } = useSelector<StoreState, AuthState>((s) => s.auth)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  // TODO handle error

  const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

  const mainViewStyle: StyleProp<ViewStyle> = {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#003e73', // TODO: add to theme
  }

  const webviewStyle: StyleProp<ViewStyle> = {
    flex: 1,
    position: 'absolute',
    paddingTop: isIOS() ? 50 : 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }

  const onLoginInit = (): void => {
    dispatch(startWebLogin())
  }

  const onCancelWebLogin = (): void => {
    dispatch(cancelWebLogin())
  }

  const showWebLogin = !!webLoginUrl

  if (showWebLogin) {
    navigateTo('WebView', { url: webLoginUrl, displayTitle: 'Log In' })
    return null
  } else {
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
      mt: theme.dimensions.marginBetween,
      py: theme.dimensions.buttonPadding,
    }

    return (
      <Box style={mainViewStyle} {...testIdProps('Login-screen', true)}>
        <CrisisLineCta onPress={onCrisisLine} />
        <Box alignItems={'center'}>
          <VAIcon name={'Logo'} />
        </Box>
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
          <VAButton onPress={onLoginInit} label={'Sign In'} textColor={'altButton'} backgroundColor={'textBox'} />
          <Pressable onPress={onFacilityLocator}>
            <Box {...findLocationProps}>
              <TextView variant={'MobileBodyBold'} display="flex" flexDirection="row" color="primaryContrast" mr={theme.dimensions.textIconMargin}>
                Find a VA Location
              </TextView>
              <VAIcon name="ArrowRight" fill="#FFF" />
            </Box>
          </Pressable>
        </Box>
      </Box>
    )
  }
}

export default LoginScreen

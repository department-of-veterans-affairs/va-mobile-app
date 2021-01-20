import { Pressable, StyleProp, ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { AuthState, StoreState } from 'store'
import { Box, BoxProps, CrisisLineCta, VAButton, VAIcon } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { TextView } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

import { useRouteNavigation } from 'utils/hooks'
import getEnv from 'utils/env'

const LoginScreen: FC = () => {
  const t = useTranslation(NAMESPACE.LOGIN)
  const { firstTimeLogin } = useSelector<StoreState, AuthState>((s) => s.auth)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  // TODO handle error

  const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

  const mainViewStyle: StyleProp<ViewStyle> = {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.splashScreen,
  }

  const onLoginInit = (): void => {
    if (firstTimeLogin) {
      navigateTo('LoaGate')()
    } else {
      navigateTo('WebviewLogin')()
    }
  }

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
        <VAButton onPress={onLoginInit} label={t('login:signin')} textColor={'altButton'} backgroundColor={'textBox'} />
        <Pressable onPress={onFacilityLocator}>
          <Box {...findLocationProps}>
            <TextView variant={'MobileBodyBold'} display="flex" flexDirection="row" color="primaryContrast" mr={theme.dimensions.textIconMargin}>
              {t('home:findLocation.title')}
            </TextView>
            <VAIcon name="ArrowRight" fill="#FFF" />
          </Box>
        </Pressable>
      </Box>
    </Box>
  )
  // }
}

export default LoginScreen

import { Pressable, StyleProp, ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { AuthState, StoreState } from 'store'
import { Box, BoxProps, ButtonTypesConstants, CrisisLineCta, VAButton, VAIcon, VAScrollView } from 'components'
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
    flexGrow: 1,
    backgroundColor: theme.colors.background.splashScreen,
  }

  const onLoginInit = firstTimeLogin ? navigateTo('LoaGate') : navigateTo('WebviewLogin')

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

  return (
    <VAScrollView {...testIdProps('Login-page', true)} contentContainerStyle={mainViewStyle}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box flex={1} justifyContent="space-between">
        <Box alignItems={'center'} flex={1} justifyContent={'center'}>
          <VAIcon name={'Logo'} />
        </Box>
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.contentMarginBottom}>
          <VAButton
            onPress={onLoginInit}
            label={t('login:signin')}
            testID={t('login:signin')}
            a11yHint={t('login:signin.a11yHint')}
            buttonType={ButtonTypesConstants.buttonSecondary}
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
              <VAIcon name="ArrowRight" fill="#FFF" />
            </Box>
          </Pressable>
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default LoginScreen

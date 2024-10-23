import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityRole, AccessibilityState, TouchableWithoutFeedback } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types'
import { NavigationHelpers, ParamListBase, TabNavigationState, useIsFocused } from '@react-navigation/native'

import { TFunction } from 'i18next'
import styled from 'styled-components'

import { NAMESPACE } from 'constants/namespaces'
import { a11yValueProp } from 'utils/accessibility'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { changeNavigationBarColor } from 'utils/rnNativeUIUtilities'
import { themeFn } from 'utils/theme'

import Box from './Box'
import IconWithText, { IconWithTextProps } from './IconWithText'

type TabBarRoute = {
  key: string
  name: string
}

/**
 *  Signifies the props that need to be passed in to {@link NavigationTabBar}
 */
export type NavigationTabBarProps = {
  /** the tab navigators current state */
  state: TabNavigationState<ParamListBase>

  /** the tab navigators navigation helpers */
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>

  /** useTranslations t function to translate the labels */
  translation: TFunction
}

const StyledSafeAreaView = styled(SafeAreaView)`
  background-color: ${themeFn((theme) => theme.colors.background.navButton)};
`
/**Component for the bottom tab navigation*/
const NavigationTabBar: FC<NavigationTabBarProps> = ({ state, navigation, translation }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const isNavBarFocused = useIsFocused()

  useEffect(() => {
    const navBarColor = isNavBarFocused ? theme.colors.background.navButton : theme.colors.background.main
    const isLightTheme = theme.mode === 'light'
    changeNavigationBarColor(navBarColor, isLightTheme, false)
  }, [isNavBarFocused, theme])

  const onPress = (route: TabBarRoute, isFocused: boolean): void => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    })

    if (!isFocused && !event.defaultPrevented) {
      navigateTo(route.name)
    }
  }

  const onLongPress = (route: TabBarRoute): void => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    })
  }

  return (
    <StyledSafeAreaView edges={['bottom']}>
      <Box
        flexDirection="row"
        backgroundColor={'navButton'}
        height={theme.dimensions.navBarHeight}
        borderTopColor="primary"
        borderTopWidth={theme.dimensions.borderWidth}
        accessibilityRole="toolbar">
        {state.routes.map((route: TabBarRoute, index: number) => {
          const isFocused = state.index === index
          const routeName = route.name.replace('Tab', '')
          const lowerCaseRoute = routeName.toLowerCase()
          const translatedName = translation(`${lowerCaseRoute}.title`)

          type TouchableProps = {
            key: string
            onPress: () => void
            onLongPress: () => void
            accessibilityRole: AccessibilityRole
            accessibilityState: AccessibilityState
            accessible: boolean
          }

          const props: TouchableProps = {
            key: route.name,
            onPress: (): void => onPress(route as TabBarRoute, isFocused),
            onLongPress: (): void => onLongPress(route as TabBarRoute),
            accessibilityRole: 'link',
            accessibilityState: isFocused ? { selected: true } : { selected: false },
            accessible: true,
          }

          const iconProps: IconWithTextProps = {
            name: 'Home',
            fill: isFocused ? theme.colors.icon.active : theme.colors.icon.inactive,
            label: routeName,
            labelColor: isFocused ? 'textWithIconButton' : 'textWithIconButtonInactive',
            height: 24,
            width: 24,
          }
          switch (routeName) {
            case 'Home':
              iconProps.height = 28
              iconProps.width = 28
              iconProps.mt = -1
              iconProps.name = isFocused ? 'Home' : 'HomeOutlined'
              break
            case 'Health':
              iconProps.name = isFocused ? 'MedicalServices' : 'MedicalServicesOutlined'
              break
            case 'Benefits':
              iconProps.name = isFocused ? 'Description' : 'DescriptionOutlined'
              break
            case 'Payments':
              iconProps.name = isFocused ? 'RequestQuote' : 'RequestQuoteOutlined'
              break
            default:
              iconProps.name = 'Home'
          }

          return (
            <TouchableWithoutFeedback
              accessibilityLabel={translatedName}
              testID={translatedName}
              {...props}
              {...a11yValueProp({ text: t('listPosition', { position: index + 1, total: state.routes.length }) })}>
              <Box flex={1} display="flex" flexDirection="column" mt={7}>
                <Box alignSelf="center" position="absolute" mt={theme.dimensions.buttonBorderWidth}>
                  <IconWithText {...iconProps} />
                </Box>
              </Box>
            </TouchableWithoutFeedback>
          )
        })}
      </Box>
    </StyledSafeAreaView>
  )
}

export default NavigationTabBar

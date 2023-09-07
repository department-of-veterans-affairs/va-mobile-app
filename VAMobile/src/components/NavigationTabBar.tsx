import { AccessibilityRole, AccessibilityState, TouchableWithoutFeedback } from 'react-native'
import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'
import styled from 'styled-components'

import { NAMESPACE } from 'constants/namespaces'
import { VA_ICON_MAP } from './VAIcon'
import { a11yValueProp, testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useTheme } from 'utils/hooks'
import Box from './Box'
import VAIconWithText, { VAIconWithTextProps } from './VAIconWithText/VAIconWithText'

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

  const onPress = (route: TabBarRoute, isFocused: boolean): void => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    })

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name)
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
            accessibilityRole: 'tab',
            accessibilityState: isFocused ? { selected: true } : { selected: false },
            accessible: true,
          }

          const iconProps: VAIconWithTextProps = {
            name: `${routeName}${isFocused ? 'Selected' : 'Unselected'}` as keyof typeof VA_ICON_MAP,
            fill: isFocused ? 'active' : 'inactive',
            label: routeName,
            labelColor: isFocused ? 'textWithIconButton' : 'textWithIconButtonInactive',
          }

          return (
            <TouchableWithoutFeedback
              {...testIdProps(translatedName)}
              {...props}
              {...a11yValueProp({ text: t('listPosition', { position: index + 1, total: state.routes.length }) })}>
              <Box flex={1} display="flex" flexDirection="column" mt={7}>
                <Box alignSelf="center" position="absolute" mt={theme.dimensions.buttonBorderWidth}>
                  <VAIconWithText {...iconProps} />
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

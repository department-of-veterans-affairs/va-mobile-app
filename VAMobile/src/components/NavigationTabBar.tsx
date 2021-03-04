import { AccessibilityRole, AccessibilityState, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TFunction } from 'i18next'
import React, { FC } from 'react'
import styled from 'styled-components'

import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useTheme } from 'utils/hooks'
import Box from './Box'
import VAIcon from './VAIcon'

type StyledLabelProps = {
  isFocused: boolean
}

const StyledLabel = styled(Text)<StyledLabelProps>`
	color: ${themeFn<StyledLabelProps>((theme, props) => (props.isFocused ? theme.colors.icon.active : theme.colors.icon.inactive))}
	align-self: center;
	margin-top: 24px;
	font-size: 12px;
	letter-spacing: -0.2px;
`

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

  badges?: { [key: string]: string | number }
}

const NavigationTabBar: FC<NavigationTabBarProps> = ({ state, navigation, translation, badges }) => {
  const theme = useTheme()

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

  const tabBarIcon = (route: TabBarRoute, focused: boolean): React.ReactNode => {
    const transparent = 'none'
    const styles = StyleSheet.create({
      badge: {
        position: 'absolute',
        right: -6,
        top: -3,
        backgroundColor: 'red',
        borderRadius: 6,
        width: 12,
        height: 12,
        justifyContent: 'center',
        alignItems: 'center',
      },
    })
    switch (route.name) {
      case 'Appointments':
      case 'Claims':
      case 'Profile':
      case 'Home':
        const iconProps = {
          id: `${route.name.toLowerCase()}${focused ? 'Selected' : 'Unselected'}`,
          name: route.name,
          stroke: focused ? transparent : 'inactive',
          fill: focused ? 'active' : transparent,
        }
        return (
          <View>
            <VAIcon {...iconProps} />
            {badges && badges[route.name] ? <Text style={styles.badge}>{badges[route.name]}</Text> : null}
          </View>
        )
      default:
        return ''
    }
  }
  console.log(state)
  console.log(navigation)
  return (
    <SafeAreaView edges={['bottom']}>
      <Box flexDirection="row" height={56} borderTopColor="primary" borderTopWidth={theme.dimensions.borderWidth} accessibilityRole="toolbar">
        {state.routes.map((route: TabBarRoute, index: number) => {
          const isFocused = state.index === index
          const translatedName = translation(`${route.name.toLowerCase()}:title`)

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
            accessibilityRole: 'imagebutton',
            accessibilityState: isFocused ? { selected: true } : { selected: false },
            accessible: true,
          }

          return (
            <TouchableWithoutFeedback {...testIdProps(translatedName + '-nav-option')} {...props}>
              <Box flex={1} display="flex" flexDirection="column" mt={theme.dimensions.navigationBarIconMarginTop}>
                <Box alignSelf="center" position="absolute">
                  {tabBarIcon(route as TabBarRoute, isFocused)}
                </Box>
                <StyledLabel allowFontScaling={false} isFocused={isFocused}>
                  {translatedName}
                </StyledLabel>
              </Box>
            </TouchableWithoutFeedback>
          )
        })}
      </Box>
    </SafeAreaView>
  )
}

export default NavigationTabBar
